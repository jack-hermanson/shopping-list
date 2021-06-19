import express, { Response, Request as NormalRequest } from "express";
import { Request } from "../utils/Request";
import { AccountService } from "../services/AccountService";
import { auth } from "../middleware/auth";
import { LoginOrNewAccountRequest } from "../../../shared/resource_models/account";
import { validateRequest } from "jack-hermanson-ts-utils/lib/functions/validation";
import { Account, newAccountSchema } from "../models/Account";
import { sendError } from "jack-hermanson-ts-utils/lib/functions/errors";
import { Socket } from "socket.io";
import { HTTP } from "jack-hermanson-ts-utils";

export const router = express.Router();

// get accounts
router.get("/", async (req: Request<any>, res: Response) => {
    res.json(await AccountService.getAll());
});

// new account
router.post(
    "/",
    async (req: Request<LoginOrNewAccountRequest>, res: Response) => {
        try {
            if (!(await validateRequest(newAccountSchema, req, res))) return;

            const requestBody: LoginOrNewAccountRequest = req.body;
            const newAccount = await AccountService.create(requestBody, res);

            if (!newAccount) return;
            delete newAccount.password;

            res.status(HTTP.CREATED).json(newAccount);
        } catch (error) {
            sendError(error, res);
        }
    }
);

// log in
router.post(
    "/login",
    async (req: Request<LoginOrNewAccountRequest>, res: Response) => {
        try {
            if (!(await validateRequest(newAccountSchema, req, res))) return;
            const requestBody: LoginOrNewAccountRequest = req.body;

            const token = await AccountService.logIn(requestBody, res);
            if (!token) return;

            res.json({ token });
        } catch (error) {
            sendError(error, res);
        }
    }
);

// log out
router.post("/logout", auth, async (req: Request<any>, res: Response) => {
    try {
        const success = await AccountService.logOut(req.account.token, res);
        if (!success) {
            return;
        }

        res.sendStatus(HTTP.OK);
    } catch (error) {
        sendError(error, res);
    }
});

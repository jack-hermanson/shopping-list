import express, { Response } from "express";
import { Request } from "../utils/Request";
import { AccountService } from "../services/AccountService";
import { auth } from "../middleware/auth";
import {
    AccountRecord,
    LoginOrNewAccountRequest,
} from "../../../shared/resource_models/account";
import { validateRequest } from "jack-hermanson-ts-utils/lib/functions/validation";
import { newAccountSchema } from "../models/Account";
import { sendError } from "jack-hermanson-ts-utils/lib/functions/errors";
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

            const account = await AccountService.logIn(requestBody, res);
            if (!account) return;

            res.json(account);
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

// log in with token
router.post("/token", auth, async (req: Request<any>, res: Response) => {
    const account: AccountRecord = { ...req.account };
    res.json(account);
});

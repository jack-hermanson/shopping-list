import express, { Response } from "express";
import { Request } from "../utils/Request";
import { AccountService } from "../services/AccountService";
import { auth } from "../middleware/auth";
import {
    AccountRecord,
    AdminEditAccountRequest,
    EditAccountRequest,
    LoginOrNewAccountRequest,
} from "../../../shared/resource_models/account";
import { validateRequest } from "jack-hermanson-ts-utils/lib/functions/validation";
import {
    Account,
    adminEditAccountSchema,
    editMyAccountSchema,
    newAccountSchema,
} from "../models/Account";
import { sendError } from "jack-hermanson-ts-utils/lib/functions/errors";
import { HTTP } from "jack-hermanson-ts-utils";
import { minClearance } from "../utils/clearance";
import { Clearance, SocketEvent } from "../../../shared/enums";
import { Socket } from "socket.io";

export const router = express.Router();

// get accounts
router.get("/", auth, async (req: Request<any>, res: Response) => {
    res.json(
        (await AccountService.getAll()).map(a => {
            delete a.token;
            delete a.password;
            return a;
        })
    );
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

// edit my own account
router.put(
    "/me",
    auth,
    async (req: Request<EditAccountRequest>, res: Response<AccountRecord>) => {
        if (!(await validateRequest(editMyAccountSchema, req, res))) return;
        const editAccountRequest: EditAccountRequest = req.body;

        const editedAccount = await AccountService.editMyAccount(
            req.account,
            editAccountRequest,
            res
        );
        if (!editedAccount) return;
        delete editedAccount.password;
        delete editedAccount.token;

        const socket: Socket = req.app.get("socketio");
        socket.emit(SocketEvent.UPDATE_ACCOUNTS);

        res.json({ ...editedAccount });
    }
);

// edit someone else's account
router.put(
    "/edit/:id",
    auth,
    async (
        req: Request<{ id: number; AdminEditAccountRequest }>,
        res: Response<AccountRecord>
    ) => {
        if (!(await minClearance(req.account, Clearance.SUPER_ADMIN, res)))
            return;
        if (!(await validateRequest(adminEditAccountSchema, req, res))) return;

        const adminEditAccountRequest: AdminEditAccountRequest = req.body;
        const accountId = req.params.id;

        const editedAccount = await AccountService.adminEditAccount(
            accountId,
            adminEditAccountRequest,
            res
        );
        if (!editedAccount) return;

        delete editedAccount.password;
        delete editedAccount.username;

        const socket: Socket = req.app.get("socketio");
        socket.emit(SocketEvent.UPDATE_ACCOUNTS);

        res.json({ ...editedAccount });
    }
);

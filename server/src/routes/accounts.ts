import express, { Response } from "express";
import { Request } from "../utils/Request";
import { AccountService } from "../services/AccountService";
import { auth } from "../middleware/auth";

export const router = express.Router();

// get accounts
router.get("/", auth, async (req: Request<any>, res: Response) => {
    res.json(await AccountService.getAll());
});

// new account
router.post("/", async (req: Request<any>, res: Response) => {
    res.json({ test: true });
});

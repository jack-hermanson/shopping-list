import express, { Response, Request } from "express";
import { AccountService } from "../services/AccountService";

export const router = express.Router();

// get accounts
router.get("/", async (req: Request, res: Response) => {
    res.json(await AccountService.getAll());
});

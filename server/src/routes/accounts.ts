import express, { Response, Request } from "express";

export const router = express.Router();

// get accounts
router.get("/", async (req: Request, res: Response) => {
    res.json({});
});

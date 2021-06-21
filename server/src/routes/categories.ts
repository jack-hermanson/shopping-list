import express, { Response } from "express";
import { auth } from "../middleware/auth";
import { Request } from "../utils/Request";
import { Clearance } from "../../../shared/enums";
import { HTTP } from "jack-hermanson-ts-utils";
import { CategoryRecord } from "../../../shared/resource_models/category";
import { CategoryService } from "../services/CategoryService";

export const router = express.Router();

router.get("/", auth, async (req: Request<any>, res: Response) => {
    if (req.account.clearance < Clearance.NORMAL) {
        return res.sendStatus(HTTP.FORBIDDEN);
    }
    const categories: CategoryRecord[] = await CategoryService.getAll();
    res.json(categories);
});

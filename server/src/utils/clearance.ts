import { Account } from "../models/Account";
import { Clearance } from "../../../shared/enums";
import { Response } from "express";
import { HTTP } from "jack-hermanson-ts-utils";

export const minClearance = (
    account: Account,
    clearance: Clearance,
    res: Response
): boolean => {
    if (account.clearance < clearance) {
        res.sendStatus(HTTP.FORBIDDEN);
        return false;
    }
    return true;
};

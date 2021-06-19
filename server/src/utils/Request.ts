import { Request as NormalRequest } from "express";
import { Account } from "../models/Account";

export interface Request<T> extends NormalRequest<T> {
    account?: Account;
}

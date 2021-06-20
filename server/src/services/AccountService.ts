import { Account } from "../models/Account";
import { getConnection, Repository } from "typeorm";
import {
    AccountRecord,
    LoginOrNewAccountRequest,
} from "../../../shared/resource_models/account";
import { doesNotConflict } from "jack-hermanson-ts-utils/lib/functions/validation";
import { Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import { HTTP } from "jack-hermanson-ts-utils";

const getRepos = (): {
    accountRepo: Repository<Account>;
} => {
    const connection = getConnection();
    const accountRepo = connection.getRepository(Account);
    return { accountRepo };
};

export abstract class AccountService {
    // get existing accounts
    static async getAll(): Promise<Account[]> {
        const { accountRepo } = getRepos();
        return await accountRepo.find();
    }

    // create new account
    static async create(
        newAccount: LoginOrNewAccountRequest,
        res: Response
    ): Promise<Account | undefined> {
        const { accountRepo } = getRepos();

        // check for existing
        newAccount.username = newAccount.username.toLowerCase();
        if (
            !(await doesNotConflict({
                repo: accountRepo,
                properties: [{ name: "username", value: newAccount.username }],
                res,
            }))
        ) {
            return undefined;
        }

        // create the account
        const salt = await bcrypt.genSalt(10);

        const account = new Account();
        account.username = newAccount.username;
        account.password = await bcrypt.hash(newAccount.password, salt);

        return await accountRepo.save(account);
    }

    // log in - returns token
    static async logIn(
        loginRequest: LoginOrNewAccountRequest,
        res: Response
    ): Promise<AccountRecord | undefined> {
        const { accountRepo } = getRepos();

        // look up user
        loginRequest.username = loginRequest.username.toLowerCase();
        const account = await accountRepo.findOne({
            username: loginRequest.username,
        });

        // not found
        if (!account) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        // wrong password
        const passwordIsValid = await bcrypt.compare(
            loginRequest.password,
            account.password
        );
        if (!passwordIsValid) {
            res.sendStatus(HTTP.BAD_REQUEST);
            return undefined;
        }

        // create token
        const token = jwt.sign({ id: account.id }, process.env.SECRET_KEY);

        // save token
        await accountRepo.update(account, { token });
        const updatedAccount = await accountRepo.findOne({ token });
        return { ...updatedAccount };
    }

    static async logOut(
        token: string,
        res: Response
    ): Promise<boolean | undefined> {
        const { accountRepo } = getRepos();

        const account = await this.getAccountFromToken(token, res);

        await accountRepo.update(account, { token: undefined });
        return true;
    }

    static async getAccountFromToken(
        token: string,
        res: Response
    ): Promise<Account | undefined> {
        const { accountRepo } = getRepos();

        const account = await accountRepo.findOne({ token });
        if (!account) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        return account;
    }
}

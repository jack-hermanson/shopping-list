import { Account } from "../models/Account";
import { getConnection, Repository } from "typeorm";
import {
    AccountRecord,
    AdminEditAccountRequest,
    EditAccountRequest,
    LoginOrNewAccountRequest,
} from "../../../shared/resource_models/account";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";
import { Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";

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

    // hash a password
    static async hashPassword(rawPassword: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(rawPassword, salt);
    }

    // get one account
    static async getOne(
        accountId: number,
        res: Response
    ): Promise<Account | undefined> {
        const { accountRepo } = getRepos();

        const account = await accountRepo.findOne(accountId);
        if (!account) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        return account;
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

        const account = new Account();
        account.username = newAccount.username;
        account.password = await this.hashPassword(newAccount.password);

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
        delete updatedAccount.password;
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

    static async okayToChangeUsername(
        account: Account,
        newUsername: string,
        res: Response
    ): Promise<boolean | undefined> {
        const { accountRepo } = getRepos();

        if (
            !(await doesNotConflict({
                repo: accountRepo,
                properties: [{ name: "username", value: newUsername }],
                existingRecord: account,
                res,
            }))
        ) {
            return undefined;
        }

        return true;
    }

    static async editMyAccount(
        account: Account,
        editAccountReq: EditAccountRequest,
        res: Response
    ): Promise<Account | undefined> {
        const { accountRepo } = getRepos();

        if (editAccountReq.password) {
            account.password = await this.hashPassword(editAccountReq.password);
        }

        editAccountReq.username = editAccountReq.username.toLowerCase();
        if (
            !(await this.okayToChangeUsername(
                account,
                editAccountReq.username,
                res
            ))
        ) {
            return undefined;
        }

        account.username = editAccountReq.username;

        return await accountRepo.save(account);
    }

    static async adminEditAccount(
        accountId: number,
        editAccountReq: AdminEditAccountRequest,
        res: Response
    ): Promise<Account | undefined> {
        const { accountRepo } = getRepos();

        const account = await accountRepo.findOne(accountId);
        if (!account) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        if (editAccountReq.password) {
            account.password = await this.hashPassword(editAccountReq.password);
        }

        editAccountReq.username = editAccountReq.username.toLowerCase();
        if (
            !(await this.okayToChangeUsername(
                account,
                editAccountReq.username,
                res
            ))
        ) {
            return undefined;
        }

        account.username = editAccountReq.username;
        account.clearance = editAccountReq.clearance;

        return await accountRepo.save(account);
    }
}

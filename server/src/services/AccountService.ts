import { Account } from "../models/Account";
import { getConnection, Repository } from "typeorm";
import { LoginOrNewAccountRequest } from "../../../shared/resource_models/account";
import { doesNotConflict } from "jack-hermanson-ts-utils/lib/functions/validation";
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
}

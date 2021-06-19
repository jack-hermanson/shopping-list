import { Account } from "../models/Account";
import { getConnection, Repository } from "typeorm";
import { LoginOrNewAccountRequest } from "../../../shared/resource_models/account";

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
    static async create(newAccount: LoginOrNewAccountRequest) {

    }
}

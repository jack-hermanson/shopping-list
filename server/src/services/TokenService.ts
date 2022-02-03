import { getConnection, Repository } from "typeorm";
import { Token } from "../models/Token";
import * as jwt from "jsonwebtoken";
import { UseTokenRequest } from "../../../shared/resource_models/token";
import { Response } from "express";
import { HTTP } from "jack-hermanson-ts-utils";

const getRepos = (): {
    tokenRepo: Repository<Token>;
} => {
    const connection = getConnection();
    const tokenRepo = connection.getRepository(Token);
    return {
        tokenRepo,
    };
};

export abstract class TokenService {
    /**
     * Create a token for a specific account.
     * @param accountId - The account you are logging in.
     * @param ipAddress - If the IP address is available, save it.
     */
    static async create(accountId: number, ipAddress?: string): Promise<Token> {
        const { tokenRepo } = getRepos();

        // create token
        const tokenString = jwt.sign({ id: accountId }, process.env.SECRET_KEY);
        const token = new Token();
        token.data = tokenString;
        token.accountId = accountId;
        token.ipAddress = ipAddress;

        return await tokenRepo.save(token);
    }

    /**
     * Log out everywhere for a specific account.
     * @param accountId - The account you are logging out everywhere.
     */
    static async deleteAll(accountId: number): Promise<void> {
        const { tokenRepo } = getRepos();

        const tokens = await tokenRepo.find({
            accountId,
        });
        for (let token of tokens) {
            await tokenRepo.delete(token);
        }

        return;
    }

    /**
     * Log out one specific token.
     * @param id - The ID of the token you are logging out.
     */
    static async deleteOne(id: number): Promise<void> {
        const { tokenRepo } = getRepos();
        await tokenRepo.delete({ id });
        return;
    }

    static async update(
        id: number,
        useTokenRequest: UseTokenRequest,
        res: Response
    ): Promise<Token | undefined> {
        const { tokenRepo } = getRepos();
        const token = await tokenRepo.findOne({ id });
        if (!token) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }
        return await tokenRepo.save({
            ...token,
            ipAddress: useTokenRequest.ipAddress || null,
        });
    }
}

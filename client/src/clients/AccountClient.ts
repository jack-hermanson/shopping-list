import {
    AccountRecord,
    LoginOrNewAccountRequest,
} from "../../../shared/resource_models/account";
import axios from "axios";
import { deleteToken, getToken } from "../utils/tokens";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class AccountClient {
    static baseUrl = "/api/accounts";

    static async login(
        loginRequest: LoginOrNewAccountRequest
    ): Promise<AccountRecord> {
        const response = await axios.post<AccountRecord>(
            `${this.baseUrl}/login`,
            loginRequest
        );
        return response.data;
    }

    static async loginWithToken(): Promise<AccountRecord | undefined> {
        const token = getToken();
        if (!token) {
            return undefined;
        }
        try {
            const response = await axios.post<AccountRecord>(
                `${this.baseUrl}/token`,
                null,
                getAuthHeader(token)
            );
            return response.data;
        } catch (error) {
            console.log(error.response);
            return undefined;
        }
    }

    static async logOut(token: string): Promise<void> {
        deleteToken();
        try {
            await axios.post(
                `${this.baseUrl}/logout`,
                null,
                getAuthHeader(token)
            );
        } catch (error) {
            // log out failed, so the token is probably bad anyway
            console.log(error.response);
        }
    }

    static async getAll(token: string) {
        const response = await axios.get<AccountRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }
}

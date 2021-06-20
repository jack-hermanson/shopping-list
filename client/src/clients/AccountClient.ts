import {
    AccountRecord,
    LoginOrNewAccountRequest,
} from "../../../shared/resource_models/account";
import axios from "axios";

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
}

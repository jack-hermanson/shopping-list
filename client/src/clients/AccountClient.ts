import { LoginOrNewAccountRequest } from "../../../shared/resource_models/account";
import axios from "axios";

export abstract class AccountClient {
    static baseUrl = "/api/accounts";

    static async login(
        loginRequest: LoginOrNewAccountRequest
    ): Promise<string> {
        const response = await axios.post<string>(
            `${this.baseUrl}/login`,
            loginRequest
        );
        return response.data;
    }
}

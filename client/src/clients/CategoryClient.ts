import { CategoryRecord } from "../../../shared/resource_models/category";
import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";
import { getToken } from "../utils/tokens";

export abstract class CategoryClient {
    static baseUrl = "/api/categories";

    static async getAll() {
        const token = getToken();
        if (!token) {
            throw new Error("Not authenticated.");
        }
        const response = await axios.get<CategoryRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }
}

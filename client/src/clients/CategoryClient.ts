import {
    CategoryRecord,
    CreateEditCategoryRequest,
} from "../../../shared/resource_models/category";
import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";
import { getToken } from "../utils/tokens";
import { NoAuthError } from "../utils/errors";

export abstract class CategoryClient {
    static baseUrl = "/api/categories";

    static async getAll() {
        const token = getToken();
        if (!token) {
            throw new NoAuthError();
        }
        const response = await axios.get<CategoryRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async update(id: number, editedCategory: CreateEditCategoryRequest) {
        const token = getToken();
        if (!token) {
            throw new NoAuthError();
        }

        const response = await axios.put<CategoryRecord>(
            `${this.baseUrl}/${id}`,
            editedCategory,
            getAuthHeader(token)
        );
        return response.data;
    }
}

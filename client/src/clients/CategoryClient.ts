import {
    CategoryRecord,
    CreateEditCategoryRequest,
} from "../../../shared/resource_models/category";
import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class CategoryClient {
    static baseUrl = "/api/categories";

    static async getAll(token: string) {
        const response = await axios.get<CategoryRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async update(
        id: number,
        editedCategory: CreateEditCategoryRequest,
        token: string
    ) {
        const response = await axios.put<CategoryRecord>(
            `${this.baseUrl}/${id}`,
            editedCategory,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getOne(id: number, token: string) {
        const response = await axios.get<CategoryRecord>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async create(newCategory: CreateEditCategoryRequest, token: string) {
        if (newCategory.notes === "") {
            delete newCategory.notes;
        }

        const response = await axios.post<CategoryRecord>(
            this.baseUrl,
            newCategory,
            getAuthHeader(token)
        );
        return response.data;
    }
}

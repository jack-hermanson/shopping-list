import {
    ItemRecord,
    CreateEditItemRequest,
} from "../../../shared/resource_models/item";
import axios from "axios";
import { getAuthHeader } from "jack-hermanson-ts-utils";

export abstract class ItemClient {
    static baseUrl = "/api/items";

    static async getAll(token: string) {
        const response = await axios.get<ItemRecord[]>(
            this.baseUrl,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async create(item: CreateEditItemRequest, token: string) {
        const response = await axios.post<ItemRecord>(
            this.baseUrl,
            item,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async update(
        id: number,
        item: CreateEditItemRequest,
        token: string
    ) {
        const response = await axios.put<ItemRecord>(
            `${this.baseUrl}/${id}`,
            item,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async getOne(id: number, token: string) {
        const response = await axios.get<ItemRecord>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }

    static async toggleCheck(id: number, checked: boolean, token: string) {
        const response = await axios.put<ItemRecord>(
            `${this.baseUrl}/check/${id}`,
            { checked },
            getAuthHeader(token)
        );
        return response.data;
    }

    static async deleteItem(id: number, token: string) {
        const response = await axios.delete<boolean>(
            `${this.baseUrl}/${id}`,
            getAuthHeader(token)
        );
        return response.data;
    }
}

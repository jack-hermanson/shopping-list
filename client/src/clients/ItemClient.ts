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
}

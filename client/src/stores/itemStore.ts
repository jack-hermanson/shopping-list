import { StoreModel } from "./_store";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { ItemClient } from "../clients/ItemClient";
import { errorAlert, successAlert } from "jack-hermanson-ts-utils";
import {
    CreateEditItemRequest,
    ItemRecord,
} from "../../../shared/resource_models/item";

export interface ItemStoreModel {
    items: ItemRecord[] | undefined;
    setItems: Action<StoreModel, ItemRecord[]>;
    loadItems: Thunk<StoreModel, string>;
    saveItem: Thunk<StoreModel, { item: CreateEditItemRequest; token: string }>;
    updateItem: Thunk<
        StoreModel,
        { id: number; item: CreateEditItemRequest; token: string }
    >;
    changeItem: Action<StoreModel, ItemRecord>;
    loadItem: Thunk<StoreModel, { id: number; token: string }>;
    toggleItemCheck: Thunk<
        StoreModel,
        { id: number; checked: boolean; token: string }
    >;
    newItemCategory: number | undefined;
    setNewItemCategory: Action<StoreModel, number | undefined>;
    deleteItem: Thunk<StoreModel, { itemId: number; token: string }>;
    toggleAllItems: Thunk<StoreModel, { checked: boolean; token: string }>;
}

export const itemStore: ItemStoreModel = {
    items: undefined,
    setItems: action((state, payload) => {
        state.items = payload;
    }),
    loadItems: thunk(async (actions, token) => {
        try {
            const items = await ItemClient.getAll(token);
            actions.setItems(items);
        } catch (error) {
            console.error(error.response);
            actions.addAlert(errorAlert(error.message));
            throw error;
        }
    }),
    saveItem: thunk(async (actions, payload) => {
        try {
            await ItemClient.create(payload.item, payload.token);
            actions.addAlert(
                successAlert(`item "${payload.item.name}"`, "added")
            );
        } catch (error) {
            console.error(error.response);
            actions.addAlert(errorAlert(error.message));
            throw error;
        }
    }),
    updateItem: thunk(async (actions, payload) => {
        try {
            await ItemClient.update(payload.id, payload.item, payload.token);
            actions.addAlert(
                successAlert(`item "${payload.item.name}"`, "edited")
            );
        } catch (error) {
            console.error(error.response);
            actions.addAlert(errorAlert(error.message));
            throw error;
        }
    }),
    changeItem: action((state, payload) => {
        state.items = state.items?.map(item => {
            if (item.id === payload.id) {
                return payload;
            }
            return item;
        });
    }),
    loadItem: thunk(async (actions, payload) => {
        try {
            const item = await ItemClient.getOne(payload.id, payload.token);
            actions.changeItem(item);
        } catch (error) {
            console.error(error.response);
            actions.addAlert(errorAlert(error.message));
        }
    }),
    toggleItemCheck: thunk(async (actions, payload) => {
        try {
            await ItemClient.toggleCheck(
                payload.id,
                payload.checked,
                payload.token
            );
        } catch (error) {
            console.error(error.response);
            actions.addAlert(errorAlert(error.message));
        }
    }),
    newItemCategory: undefined,
    setNewItemCategory: action((state, categoryId) => {
        state.newItemCategory = categoryId;
    }),
    deleteItem: thunk(async (actions, payload) => {
        try {
            await ItemClient.deleteItem(payload.itemId, payload.token);
            actions.addAlert(successAlert("item", "deleted"));
        } catch (error) {
            console.log(error.response);
            actions.addAlert(errorAlert(error.message));
            throw error;
        }
    }),
    toggleAllItems: thunk(async (actions, payload) => {
        try {
            await ItemClient.toggleAll(payload.checked, payload.token);
        } catch (error) {
            console.error(error.response);
            actions.addAlert(errorAlert(error.message));
            throw error;
        }
    }),
};

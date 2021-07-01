import { StoreModel } from "./store";
import { action, thunk } from "easy-peasy";
import { ItemClient } from "../clients/ItemClient";
import { errorAlert, successAlert } from "jack-hermanson-ts-utils";

export const itemStore: Partial<StoreModel> = {
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
};

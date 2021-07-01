import { StoreModel } from "./_store";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { CategoryClient } from "../clients/CategoryClient";
import { errorAlert, HTTP, successAlert } from "jack-hermanson-ts-utils";
import { deleteToken } from "../utils/tokens";
import {
    CategoryRecord,
    CreateEditCategoryRequest,
} from "../../../shared/resource_models/category";

export interface CategoryStoreModel {
    categories: CategoryRecord[] | undefined;
    setCategories: Action<StoreModel, CategoryRecord[] | undefined>;
    loadCategories: Thunk<StoreModel, string>;
    updateCategory: Thunk<
        StoreModel,
        {
            id: number;
            editedCategory: CreateEditCategoryRequest;
            token: string;
            alert?: boolean;
        }
    >;
    loadCategory: Thunk<StoreModel, { id: number; token: string }>;
    changeCategory: Action<StoreModel, CategoryRecord>;
    saveCategory: Thunk<
        StoreModel,
        { newCategory: CreateEditCategoryRequest; token: string }
    >;
    deleteCategory: Thunk<StoreModel, { id: number; token: string }>;
}

export const categoryStore: CategoryStoreModel = {
    categories: undefined,
    setCategories: action((state, payload) => {
        state.categories = payload;
    }),
    loadCategories: thunk(async (actions, token) => {
        try {
            const categories = await CategoryClient.getAll(token);
            actions.setCategories(categories);
        } catch (error) {
            // token isn't good anymore
            if (error.response?.status === HTTP.UNAUTHORIZED) {
                deleteToken();
                actions.setCurrentUser(undefined);
            }
            // incorrect permissions
            if (error.response?.status === HTTP.FORBIDDEN) {
                console.error("Insufficient permissions.");
            }
            actions.setCategories([]);
        }
    }),
    updateCategory: thunk(
        async (actions, { editedCategory, id, token, alert = false }) => {
            try {
                actions.changeCategory({ id, ...editedCategory });
                // ^ this line isn't really necessary, but it makes the UI feel more responsive

                await CategoryClient.update(id, editedCategory, token);
                if (alert) {
                    actions.addAlert(
                        successAlert(
                            `the "${editedCategory.name}" category`,
                            "edited"
                        )
                    );
                }
            } catch (error) {
                console.error(error.response);
                actions.addAlert(errorAlert(error.message));
                throw error;
            }
        }
    ),
    loadCategory: thunk(async (actions, { id, token }) => {
        try {
            const category = await CategoryClient.getOne(id, token);
            actions.changeCategory(category);
        } catch (error) {
            actions.addAlert(errorAlert(error.message));
        }
    }),
    changeCategory: action((state, payload) => {
        if (state.categories) {
            state.categories = state.categories.map(c => {
                if (c.id !== payload.id) {
                    return c;
                }
                return payload;
            });
        }
    }),
    saveCategory: thunk(async (actions, payload) => {
        try {
            await CategoryClient.create(payload.newCategory, payload.token);
            actions.addAlert(
                successAlert(`category "${payload.newCategory.name}"`, "saved")
            );
        } catch (error) {
            console.error(error.response);
            actions.addAlert(errorAlert(error.message));
            throw error;
        }
    }),
    deleteCategory: thunk(async (actions, payload) => {
        try {
            await CategoryClient.delete(payload.id, payload.token);
            actions.addAlert(successAlert("category", "deleted"));
        } catch (error) {
            console.error(error.response);
            actions.addAlert(errorAlert(error.message));
            throw error;
        }
    }),
};

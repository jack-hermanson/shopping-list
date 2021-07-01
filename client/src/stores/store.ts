import {
    action,
    Action,
    createStore,
    createTypedHooks,
    thunk,
    Thunk,
} from "easy-peasy";
import {
    AlertType,
    capitalizeFirst,
    errorAlert,
    HTTP,
    successAlert,
} from "jack-hermanson-ts-utils";
import {
    AccountRecord,
    LoginOrNewAccountRequest,
} from "../../../shared/resource_models/account";
import { AccountClient } from "../clients/AccountClient";
import { deleteToken, saveToken } from "../utils/tokens";
import {
    CategoryRecord,
    CreateEditCategoryRequest,
} from "../../../shared/resource_models/category";
import { CategoryClient } from "../clients/CategoryClient";
import {
    CreateEditItemRequest,
    ItemRecord,
} from "../../../shared/resource_models/item";
import { ItemClient } from "../clients/ItemClient";
import { itemStore } from "./itemStore";

export interface StoreModel {
    alerts: AlertType[];
    setAlerts: Action<StoreModel, AlertType[]>;
    addAlert: Action<StoreModel, AlertType>;

    accounts: AccountRecord[];
    setAccounts: Action<StoreModel, AccountRecord[]>;
    addAccount: Action<StoreModel, AccountRecord>;
    loadAccounts: Thunk<StoreModel, string>;

    currentUser: AccountRecord | undefined;
    setCurrentUser: Action<StoreModel, AccountRecord | undefined>;
    logIn: Thunk<StoreModel, LoginOrNewAccountRequest>;
    logInFromStorage: Thunk<StoreModel>;
    logOut: Thunk<StoreModel, string>;

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
}

export const store = createStore<StoreModel>({
    alerts: [],
    setAlerts: action((state, payload) => {
        state.alerts = payload;
    }),
    addAlert: action((state, payload) => {
        state.alerts = [payload, ...state.alerts];
    }),

    accounts: [],
    setAccounts: action((state, payload) => {
        state.accounts = payload;
    }),
    addAccount: action((state, payload) => {
        state.accounts = [payload, ...state.accounts].sort((a, b) =>
            a.id > b.id ? 1 : -1
        );
    }),
    loadAccounts: thunk(async (actions, token) => {
        const accounts = await AccountClient.getAll(token);
        actions.setAccounts(accounts);
    }),

    currentUser: undefined,
    setCurrentUser: action((state, payload) => {
        state.currentUser = payload;
    }),
    logIn: thunk(async (actions, payload) => {
        try {
            const account = await AccountClient.login(payload);
            actions.setCurrentUser(account);
            actions.addAccount(account);
            actions.addAlert({
                text: `Welcome, ${capitalizeFirst(account.username)}.`,
                color: "success",
            });
            saveToken(account.token!);
        } catch (error) {
            actions.addAlert(errorAlert(error.message));
            console.error(error.response);
            throw error;
        }
    }),
    logInFromStorage: thunk(async actions => {
        const account = await AccountClient.loginWithToken();
        actions.setCurrentUser(account);
    }),
    logOut: thunk(async (actions, token) => {
        await AccountClient.logOut(token);
        actions.setCurrentUser(undefined);
        actions.addAlert(successAlert("user", "logged out"));
    }),

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

    ...itemStore,
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;

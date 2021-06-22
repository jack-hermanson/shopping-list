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
} from "../../shared/resource_models/account";
import { AccountClient } from "./clients/AccountClient";
import { deleteToken, saveToken } from "./utils/tokens";
import {
    CategoryRecord,
    CreateEditCategoryRequest,
} from "../../shared/resource_models/category";
import { CategoryClient } from "./clients/CategoryClient";

interface StoreModel {
    alerts: AlertType[];
    setAlerts: Action<StoreModel, AlertType[]>;
    addAlert: Action<StoreModel, AlertType>;

    accounts: AccountRecord[];
    setAccounts: Action<StoreModel, AccountRecord[]>;
    addAccount: Action<StoreModel, AccountRecord>;

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
        { id: number; editedCategory: CreateEditCategoryRequest; token: string }
    >;
    loadCategory: Thunk<StoreModel, { id: number; token: string }>;
    changeCategory: Action<StoreModel, CategoryRecord>;
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
    updateCategory: thunk(async (actions, { editedCategory, id, token }) => {
        try {
            await CategoryClient.update(id, editedCategory, token);
        } catch (error) {
            console.error(error);
        }
    }),
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
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;

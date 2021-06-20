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
    successAlert,
} from "jack-hermanson-ts-utils";
import {
    AccountRecord,
    LoginOrNewAccountRequest,
} from "../../shared/resource_models/account";
import { AccountClient } from "./clients/AccountClient";
import { saveToken } from "./utils/tokens";

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
    logOut: Thunk<StoreModel>;
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
    logOut: thunk(async actions => {
        await AccountClient.logOut();
        actions.setCurrentUser(undefined);
        actions.addAlert(successAlert("user", "logged out"));
    }),
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;

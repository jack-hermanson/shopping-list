import { StoreModel } from "./_store";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { AccountClient } from "../clients/AccountClient";
import { errorAlert, successAlert } from "jack-hermanson-ts-utils";
import { saveToken } from "../utils/tokens";
import {
    AccountRecord,
    EditAccountRequest,
    LoginOrNewAccountRequest,
} from "../../../shared/resource_models/account";

export interface UserStoreModel {
    currentUser: AccountRecord | undefined;
    setCurrentUser: Action<StoreModel, AccountRecord | undefined>;
    changeCurrentUser: Action<StoreModel, AccountRecord>;
    logIn: Thunk<StoreModel, LoginOrNewAccountRequest>;
    logInFromStorage: Thunk<StoreModel>;
    logOut: Thunk<StoreModel, string>;
    editMyAccount: Thunk<
        StoreModel,
        { editAccountReq: EditAccountRequest; token: string }
    >;
}

export const userStore: UserStoreModel = {
    currentUser: undefined,
    setCurrentUser: action((state, payload) => {
        if (payload && payload.username === "aj") {
            payload.username = "AJ";
        }
        state.currentUser = payload;
    }),
    changeCurrentUser: action((state, payload) => {
        state.currentUser = { ...state.currentUser, ...payload };
    }),
    logIn: thunk(async (actions, payload) => {
        try {
            const account = await AccountClient.login(payload);
            actions.setCurrentUser(account);
            actions.addAccount(account);
            actions.addAlert({
                text: `Welcome, ${account.username.capitalizeFirst()}.`,
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
    editMyAccount: thunk(async (actions, payload) => {
        try {
            const editedAccount = await AccountClient.editMyAccount(
                payload.editAccountReq,
                payload.token
            );
            actions.changeCurrentUser(editedAccount);
            actions.addAlert(successAlert("account", "edited"));
        } catch (error) {
            console.error(error.response);
            actions.addAlert(errorAlert(error.message));
            throw error;
        }
    }),
};

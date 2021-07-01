import { StoreModel } from "./_store";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { AccountClient } from "../clients/AccountClient";
import {
    AccountRecord,
    AdminEditAccountRequest,
} from "../../../shared/resource_models/account";
import { errorAlert, successAlert } from "jack-hermanson-ts-utils";

export interface AccountStoreModel {
    accounts: AccountRecord[];
    setAccounts: Action<StoreModel, AccountRecord[]>;
    changeAccount: Action<StoreModel, AccountRecord>;
    addAccount: Action<StoreModel, AccountRecord>;
    loadAccounts: Thunk<StoreModel, string>;
    adminEditAccount: Thunk<
        StoreModel,
        {
            accountId: number;
            editAccountReq: AdminEditAccountRequest;
            token: string;
        }
    >;
}

export const accountStore: AccountStoreModel = {
    accounts: [],
    setAccounts: action((state, payload) => {
        state.accounts = payload.map(account => {
            if (account.username === "aj") {
                account.username = "AJ";
            }
            return account;
        });
    }),
    changeAccount: action((state, payload) => {
        state.accounts = state.accounts?.map(account => {
            if (account.id === payload.id) {
                return payload;
            }
            return account;
        });
        if (state.currentUser?.id === payload.id) {
            state.currentUser = { ...state.currentUser, ...payload };
        }
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
    adminEditAccount: thunk(async (actions, payload) => {
        try {
            const editedAccount = await AccountClient.adminEditAccount(
                payload.accountId,
                payload.editAccountReq,
                payload.token
            );
            actions.changeAccount(editedAccount);
            actions.addAlert(
                successAlert(
                    `account with username "${editedAccount.username}"`,
                    "edited"
                )
            );
        } catch (error) {
            console.error(error.response);
            actions.addAlert(errorAlert(error.message));
            throw error;
        }
    }),
};

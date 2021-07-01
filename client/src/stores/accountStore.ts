import { StoreModel } from "./_store";
import { Action, action, Thunk, thunk } from "easy-peasy";
import { AccountClient } from "../clients/AccountClient";
import { AccountRecord } from "../../../shared/resource_models/account";

export interface AccountStoreModel {
    accounts: AccountRecord[];
    setAccounts: Action<StoreModel, AccountRecord[]>;
    addAccount: Action<StoreModel, AccountRecord>;
    loadAccounts: Thunk<StoreModel, string>;
}

export const accountStore: AccountStoreModel = {
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
};

import { action, Action } from "easy-peasy";
import { StoreModel } from "./_store";

export interface UncheckedItemStoreModel {
    showUncheckedGroup: boolean;
    setShowUncheckedGroup: Action<StoreModel, boolean>;
}

export const uncheckedItemStore: UncheckedItemStoreModel = {
    showUncheckedGroup: false,
    setShowUncheckedGroup: action((state, payload) => {
        state.showUncheckedGroup = payload;
    }),
};

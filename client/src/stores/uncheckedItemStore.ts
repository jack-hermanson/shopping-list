import { action, Action, computed, Computed } from "easy-peasy";
import { StoreModel } from "./_store";
import { ItemRecord } from "../../../shared/resource_models/item";

export interface UncheckedItemStoreModel {
    showUncheckedGroup: boolean;
    setShowUncheckedGroup: Action<StoreModel, boolean>;
    uncheckedItems: Computed<StoreModel, ItemRecord[] | undefined>;
}

export const uncheckedItemStore: UncheckedItemStoreModel = {
    showUncheckedGroup: false,
    setShowUncheckedGroup: action((state, payload) => {
        state.showUncheckedGroup = payload;
    }),
    uncheckedItems: computed(state => {
        return state.items?.filter(i => i.checked === false);
    }),
};

import { createStore, createTypedHooks } from "easy-peasy";
import { itemStore, ItemStoreModel } from "./itemStore";
import { categoryStore, CategoryStoreModel } from "./categoryStore";
import { alertStore, AlertStoreModel } from "./alertStore";
import { accountStore, AccountStoreModel } from "./accountStore";
import { userStore, UserStoreModel } from "./userStore";

export interface StoreModel
    extends AlertStoreModel,
        AccountStoreModel,
        UserStoreModel,
        CategoryStoreModel,
        ItemStoreModel {}

export const store = createStore<StoreModel>({
    ...alertStore,
    ...accountStore,
    ...userStore,
    ...categoryStore,
    ...itemStore,
} as StoreModel);

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;

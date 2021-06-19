import {
    createStore,
    createTypedHooks,
    action,
    Action,
    thunk,
    Thunk,
} from "easy-peasy";

interface StoreModel {}

export const store = createStore<StoreModel>({});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;

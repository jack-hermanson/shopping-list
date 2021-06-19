import {
    createStore,
    createTypedHooks,
    action,
    Action,
    thunk,
    Thunk,
} from "easy-peasy";
import { AlertType } from "jack-hermanson-ts-utils";

interface StoreModel {
    alerts: AlertType[];
    setAlerts: Action<StoreModel, AlertType[]>;
    addAlert: Action<StoreModel, AlertType>;
}

export const store = createStore<StoreModel>({
    alerts: [],
    setAlerts: action((state, payload) => {
        state.alerts = payload;
    }),
    addAlert: action((state, payload) => {
        state.alerts = [payload, ...state.alerts];
    }),
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreState = typedHooks.useStoreState;

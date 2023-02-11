import { StoreModel } from "./_store";
import { ChoreRecord } from "../../../shared/resource_models/chore";
import { action, Action, thunk, Thunk } from "easy-peasy";

export interface ChoreStoreModel {
    chores: ChoreRecord[] | undefined;
    setChores: Action<StoreModel, ChoreRecord[] | undefined>;
    loadChores: Thunk<StoreModel, string>;
}

export const choreStore: ChoreStoreModel = {
    chores: undefined,
    setChores: action((state, payload) => {
        state.chores = payload;
    }),
    loadChores: thunk((actions, payload) => {
        actions.setChores([
            {
                id: 1,
                title: "Dump litter box",
                description: "",
                intervalDays: 7,
                recurring: true,
            },
            {
                id: 2,
                title: "Water plants",
                description: "",
                intervalDays: 7,
                recurring: true,
            },
            {
                id: 3,
                title: "Wash shower towels",
                description: "",
                intervalDays: 7,
                recurring: true,
            },
            {
                id: 4,
                title: "Replace water filter",
                description: "Cats' water",
                intervalDays: 14,
                recurring: true,
            },
        ]);
    }),
};

import { StoreModel } from "./_store";
import { ChoreRecord } from "../../../shared/resource_models/chore";
import { ChoreLogRecord } from "../../../shared/resource_models/choreLog";
import { action, Action, thunk, Thunk } from "easy-peasy";
import dayjs from "dayjs";

export interface ChoreStoreModel {
    chores: ChoreRecord[] | undefined;
    setChores: Action<StoreModel, ChoreRecord[] | undefined>;
    loadChores: Thunk<StoreModel, string>;

    choreLogs: ChoreLogRecord[] | undefined;
    setChoreLogs: Action<StoreModel, ChoreLogRecord[] | undefined>;
    loadChoreLogs: Thunk<StoreModel, string>;
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

    choreLogs: undefined,
    setChoreLogs: action((state, payload) => {
        state.choreLogs = payload;
    }),
    loadChoreLogs: thunk((actions, payload) => {
        actions.setChoreLogs([
            {
                id: 1,
                choreId: 1,
                accountId: undefined,
                completedDate: undefined,
                dueDate: dayjs().add(7, "day").toDate(),
            },
            {
                id: 2,
                choreId: 2,
                accountId: 1,
                completedDate: new Date(),
                dueDate: dayjs().add(1, "day").toDate(),
            },
        ]);
    }),
};

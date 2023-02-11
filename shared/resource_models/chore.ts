import { ResourceModel } from "./_base";

export interface ChoreRequest {
    title: string;
    description: string;
    recurring: boolean;
    intervalDays: number;
}

export interface ChoreRecord extends ChoreRequest, ResourceModel {}

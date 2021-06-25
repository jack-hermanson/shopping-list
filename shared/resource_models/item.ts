import { ResourceModel } from "./_base";

export interface CreateEditItemRequest {
    name: string;
    checked: boolean;
    notes?: string;
    repeats: boolean;
    categoryIds: number[];
}

export interface ItemRecord extends ResourceModel, CreateEditItemRequest {
    updated: Date;
    accountId: number;
}

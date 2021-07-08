import { ResourceModel } from "./_base";

export interface CreateEditCategoryRequest {
    name: string;
    visible: boolean;
    notes?: string;
}

export interface CategoryRecord
    extends ResourceModel,
        CreateEditCategoryRequest {}

export interface ToggleCategoryItemsRequest {
    categoryId: number;
    checkAll: boolean; // if it's false, then uncheck all
}

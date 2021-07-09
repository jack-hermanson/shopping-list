import { getConnection, Repository } from "typeorm";
import { Category } from "../models/Category";
import {
    CreateEditCategoryRequest,
    ToggleCategoryItemsRequest,
} from "../../../shared/resource_models/category";
import { Response } from "express";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";
import { CategoryItem } from "../models/CategoryItem";
import { ItemService } from "./ItemService";
import { CategoryItemService } from "./CategoryItemService";

const getRepos = (): {
    categoryRepo: Repository<Category>;
    categoryItemRepo: Repository<CategoryItem>;
} => {
    const connection = getConnection();
    const categoryRepo = connection.getRepository(Category);
    const categoryItemRepo = connection.getRepository(CategoryItem);
    return { categoryRepo, categoryItemRepo };
};

export abstract class CategoryService {
    static async getAll(): Promise<Category[]> {
        const { categoryRepo } = getRepos();
        return await categoryRepo
            .createQueryBuilder("category")
            .orderBy("name")
            .getMany();
    }

    static async create(
        newCategory: CreateEditCategoryRequest,
        res: Response
    ): Promise<Category | undefined> {
        const { categoryRepo } = getRepos();

        if (
            !(await doesNotConflict({
                repo: categoryRepo,
                properties: [{ name: "name", value: newCategory.name }],
                res,
            }))
        ) {
            return undefined;
        }

        return await categoryRepo.save(newCategory);
    }

    static async update(
        id: number,
        editedCategory: CreateEditCategoryRequest,
        res: Response
    ): Promise<Category | undefined> {
        const { categoryRepo } = getRepos();

        const existingCategory = await categoryRepo.findOne(id);
        if (!existingCategory) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        if (
            !(await doesNotConflict({
                repo: categoryRepo,
                properties: [{ name: "name", value: editedCategory.name }],
                res,
                existingRecord: existingCategory,
            }))
        ) {
            return undefined;
        }

        return await categoryRepo.save({
            ...existingCategory,
            ...editedCategory,
        });
    }

    static async getOne(
        id: number,
        res: Response
    ): Promise<Category | undefined> {
        const { categoryRepo } = getRepos();

        const category = await categoryRepo.findOne(id);
        if (!category) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        return category;
    }

    static async deleteOne(
        id: number,
        res: Response
    ): Promise<boolean | undefined> {
        const { categoryRepo, categoryItemRepo } = getRepos();

        const category = await categoryRepo.findOne(id);
        if (!category) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        const categoryItems = await categoryItemRepo.find({ categoryId: id });
        for (let categoryItem of categoryItems) {
            await categoryItemRepo.delete(categoryItem);
        }

        await categoryRepo.delete(category);
        return true;
    }

    /**
     * Make all of the items in this category checked or unchecked.
     * Returns a list of item IDs that were affected by this action.
     * @param requestBody
     * @param accountId
     * @param res
     */
    static async toggleItems(
        requestBody: ToggleCategoryItemsRequest,
        accountId: number,
        res: Response
    ): Promise<number[] | undefined> {
        const { categoryRepo, categoryItemRepo } = getRepos();

        // is the categoryId legit?
        const category = await categoryRepo.findOne(requestBody.categoryId);
        if (!category) {
            res.status(HTTP.NOT_FOUND);
            return undefined;
        }

        // all the categoryItems within this category
        const categoryItems = await categoryItemRepo.find({
            categoryId: requestBody.categoryId,
        });

        // ids of items that were toggled
        const itemIds: number[] = [];

        // check or uncheck each item
        for (let categoryItem of categoryItems) {
            const modifiedItem = await ItemService.toggleChecked(
                categoryItem.itemId,
                requestBody.checkAll,
                accountId,
                res
            );
            if (!modifiedItem) {
                return undefined;
            }
            itemIds.push(modifiedItem.id);
        }

        return itemIds;
    }

    static async completeCategory(
        id: number,
        res: Response
    ): Promise<boolean | undefined> {
        // is the category id legit
        const category = await this.getOne(id, res);
        if (!category) {
            return undefined;
        }

        const items = await ItemService.getItemsInCategory(id);

        for (let item of items) {
            // if it's one-time only and already checked, delete it
            if (!item.repeats && item.checked) {
                await ItemService.delete(item.id, res);
            }
        }

        return true;
    }

    static async completeAllCategories(
        res: Response
    ): Promise<boolean | undefined> {
        const { categoryRepo } = getRepos();

        const categories = await categoryRepo.find();

        for (let category of categories) {
            const completed = await this.completeCategory(category.id, res);
            if (!completed) {
                return undefined;
            }
        }

        return true;
    }
}

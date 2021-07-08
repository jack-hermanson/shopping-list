import { getConnection, Repository } from "typeorm";
import { CategoryItem } from "../models/CategoryItem";
import { ItemService } from "./ItemService";
import { Response } from "express";
import { CategoryService } from "./CategoryService";
import { HTTP } from "jack-hermanson-ts-utils";

const getRepos = (): {
    categoryItemRepo: Repository<CategoryItem>;
} => {
    const connection = getConnection();
    const categoryItemRepo = connection.getRepository(CategoryItem);
    return { categoryItemRepo };
};

export abstract class CategoryItemService {
    static async getCategoryIdsFromItem(itemId: number): Promise<number[]> {
        const { categoryItemRepo } = getRepos();
        const categoryItems = await categoryItemRepo.find({ itemId });
        return categoryItems.map(ci => ci.categoryId);
    }

    static async create(
        itemId: number,
        categoryId: number,
        res: Response
    ): Promise<CategoryItem> {
        const { categoryItemRepo } = getRepos();

        // is the itemId legit?
        const item = await ItemService.getOne(itemId, res);
        if (!item) {
            return undefined;
        }

        // is the categoryId legit?
        const category = await CategoryService.getOne(categoryId, res);
        if (!category) {
            return undefined;
        }

        // is there already an association?
        const existingCategoryItem = await categoryItemRepo.findOne({
            categoryId,
            itemId,
        });
        if (existingCategoryItem) {
            res.sendStatus(HTTP.CONFLICT);
            return undefined;
        }

        // create the new association
        return await categoryItemRepo.save({ categoryId, itemId });
    }

    static async updateItemCategories(
        itemId: number,
        categoryIds: number[],
        res: Response
    ): Promise<CategoryItem[] | undefined> {
        const { categoryItemRepo } = getRepos();

        // remove any existing associations
        const existingAssociations = await categoryItemRepo.find({ itemId });
        for (let categoryItem of existingAssociations) {
            await categoryItemRepo.delete(categoryItem);
        }

        for (let categoryId of categoryIds) {
            // is this categoryId legit?
            const category = await CategoryService.getOne(categoryId, res);
            if (!category) return undefined;

            // create association
            await categoryItemRepo.save({
                categoryId,
                itemId,
            });
        }

        return await categoryItemRepo.find({ itemId });
    }

    static async deleteItemCategories(
        itemId: number,
        res: Response
    ): Promise<boolean | undefined> {
        const { categoryItemRepo } = getRepos();

        const categoryItems = await categoryItemRepo.find({ itemId });
        if (!categoryItems.length) {
            res.status(HTTP.NOT_FOUND).send(
                `No categoryItems found with item ID ${itemId}`
            );
            return undefined;
        }

        for (let categoryItem of categoryItems) {
            await categoryItemRepo.delete(categoryItem);
        }

        return true;
    }
}

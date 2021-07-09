import { getConnection, Repository } from "typeorm";
import { Item } from "../models/Item";
import { CategoryItem } from "../models/CategoryItem";
import { Response } from "express";
import { doesNotConflict, HTTP } from "jack-hermanson-ts-utils";
import {
    CreateEditItemRequest,
    ToggleAllItemsRequest,
} from "../../../shared/resource_models/item";
import { CategoryItemService } from "./CategoryItemService";

const getRepos = (): {
    itemRepo: Repository<Item>;
    categoryItemRepo: Repository<CategoryItem>;
} => {
    const connection = getConnection();
    const itemRepo = connection.getRepository(Item);
    const categoryItemRepo = connection.getRepository(CategoryItem);
    return { itemRepo, categoryItemRepo };
};

export abstract class ItemService {
    static async getAll(): Promise<Item[]> {
        const { itemRepo } = getRepos();

        return await itemRepo
            .createQueryBuilder("item")
            .orderBy("name")
            .getMany();
    }

    static async getOne(
        itemId: number,
        res: Response
    ): Promise<Item | undefined> {
        const { itemRepo } = getRepos();
        const item = await itemRepo.findOne(itemId);
        if (!item) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        return item;
    }

    static async create(
        newItem: CreateEditItemRequest,
        accountId: number,
        res: Response
    ): Promise<Item | undefined> {
        const { itemRepo } = getRepos();

        if (
            !(await doesNotConflict({
                repo: itemRepo,
                properties: [{ name: "name", value: newItem.name }],
                res,
            }))
        ) {
            return undefined;
        }

        // create item
        const item = await itemRepo.save({
            name: newItem.name,
            checked: newItem.checked,
            notes: newItem.notes,
            accountId: accountId,
            repeats: newItem.repeats,
        });

        // create associations with categories
        for (let categoryId of newItem.categoryIds) {
            await CategoryItemService.create(item.id, categoryId, res);
        }

        return item;
    }

    static async update(
        itemId: number,
        editedItem: CreateEditItemRequest,
        accountId: number,
        res: Response
    ): Promise<Item | undefined> {
        const { itemRepo } = getRepos();

        const existingItem = await itemRepo.findOne(itemId);

        // item properties
        if (
            !(await doesNotConflict({
                repo: itemRepo,
                properties: [{ name: "name", value: editedItem.name }],
                res,
                existingRecord: existingItem,
            }))
        ) {
            return undefined;
        }

        // category IDs
        const categoryIds = await CategoryItemService.updateItemCategories(
            itemId,
            editedItem.categoryIds,
            res
        );
        if (!categoryIds) {
            return undefined;
        }

        delete editedItem.categoryIds;
        return await itemRepo.save({
            ...existingItem,
            ...editedItem,
            accountId,
        });
    }

    static async delete(
        itemId: number,
        res: Response
    ): Promise<boolean | undefined> {
        const { itemRepo } = getRepos();

        const item = await itemRepo.findOne(itemId);
        if (!item) {
            res.status(HTTP.NOT_FOUND).send(`No item with ID ${itemId}`);
            return undefined;
        }

        const deletedCategoryItems =
            await CategoryItemService.deleteItemCategories(item.id, res);
        if (!deletedCategoryItems) return undefined;

        await itemRepo.delete(item.id);

        return true;
    }

    static async toggleChecked(
        itemId: number,
        checked: boolean,
        accountId: number,
        res: Response
    ): Promise<Item | undefined> {
        const { itemRepo } = getRepos();
        const item = await itemRepo.findOne(itemId);

        if (!item) {
            res.sendStatus(HTTP.NOT_FOUND);
            return undefined;
        }

        item.checked = checked;
        item.accountId = accountId;
        return await itemRepo.save(item);
    }

    /**
     * Get the items that are associated with a given category.
     * @param categoryId
     */
    static async getItemsInCategory(categoryId: number): Promise<Item[]> {
        const { itemRepo, categoryItemRepo } = getRepos();

        const categoryItems = await categoryItemRepo.find({ categoryId });
        const items: Item[] = [];

        for (let categoryItem of categoryItems) {
            const item = await itemRepo.findOne(categoryItem.itemId);
            items.push(item);
        }

        return items;
    }

    static async toggleAll(
        toggleAllItemsRequest: ToggleAllItemsRequest,
        accountId: number,
        res: Response
    ): Promise<boolean | undefined> {
        const items = await this.getAll();
        for (let item of items) {
            const updatedItem = await this.toggleChecked(
                item.id,
                toggleAllItemsRequest.checkAll,
                accountId,
                res
            );
            if (!updatedItem) {
                return undefined;
            }
        }
        return true;
    }
}

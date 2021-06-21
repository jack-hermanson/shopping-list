import { getConnection, Repository } from "typeorm";
import { Category } from "../models/Category";
import { CreateEditCategoryRequest } from "../../../shared/resource_models/category";
import { Response } from "express";
import { doesNotConflict } from "jack-hermanson-ts-utils/lib/functions/validation";

const getRepos = (): {
    categoryRepo: Repository<Category>;
} => {
    const connection = getConnection();
    const categoryRepo = connection.getRepository(Category);
    return { categoryRepo };
};

export abstract class CategoryService {
    static async getAll(): Promise<Category[]> {
        const { categoryRepo } = getRepos();
        return await categoryRepo.find();
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
}

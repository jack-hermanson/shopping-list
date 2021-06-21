import { getConnection, Repository } from "typeorm";
import { Category } from "../models/Category";

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
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Joi from "joi";

@Entity({ name: "category" })
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, default: true })
    visible: boolean;

    @Column({ nullable: true })
    notes?: string;
}

const createEditCategory = {
    name: Joi.string().required().min(2),
    visible: Joi.boolean().required(),
    notes: Joi.string().optional(),
};

export const createEditCategorySchema = Joi.object()
    .options({ abortEarly: false })
    .keys(createEditCategory);

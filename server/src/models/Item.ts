import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Joi from "joi";

@Entity({ name: "item" })
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, default: false })
    checked: boolean;

    @Column({ nullable: true })
    notes?: string;

    @UpdateDateColumn()
    updated: Date;

    @Column({ type: "int", nullable: false })
    accountId: number; // id of the last account that updated this record

    @Column({ type: "boolean", default: false, nullable: false })
    repeats: boolean;
}

const createEditItem = {
    name: Joi.string().required().min(2),
    checked: Joi.boolean().required(),
    notes: Joi.optional(),
    repeats: Joi.boolean().required(),
    categoryIds: Joi.array().required().items(Joi.number()).min(1),
};

export const createEditItemSchema = Joi.object()
    .options({ abortEarly: false, allowUnknown: true })
    .keys(createEditItem);

export const toggleAllItemsSchema = Joi.object()
    .options({ abortEarly: false, allowUnknown: true })
    .keys({ checkAll: Joi.boolean().required() });

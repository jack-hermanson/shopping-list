import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import Joi from "joi";
import { Clearance } from "../../../shared/enums";

@Entity({ name: "account" })
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    username: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true })
    token?: string;

    @Column({ nullable: false, default: Clearance.NONE })
    clearance: Clearance;
}

const usernameSchema = Joi.string().min(2).required();
const passwordSchema = Joi.string().min(2);

export const newAccountSchema = Joi.object()
    .options({ abortEarly: false })
    .keys({
        username: usernameSchema,
        password: passwordSchema.required(),
    });

export const editMyAccountSchema = Joi.object()
    .options({ abortEarly: false })
    .keys({
        username: usernameSchema,
        password: passwordSchema.optional(),
    });

export const adminEditAccountSchema = Joi.object()
    .options({ abortEarly: false })
    .keys({
        username: usernameSchema,
        password: passwordSchema.optional(),
        clearance: Joi.number()
            .min(Clearance.NONE)
            .max(Clearance.SUPER_ADMIN)
            .required(),
    });

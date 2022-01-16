import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import Joi from "joi";

@Entity({ name: "token" })
export class Token {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    data: string;

    @UpdateDateColumn()
    updated: Date;

    @Column({ type: "int", nullable: false })
    accountId: number;
}

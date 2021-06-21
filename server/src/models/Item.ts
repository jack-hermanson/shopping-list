import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

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
}

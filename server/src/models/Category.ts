import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

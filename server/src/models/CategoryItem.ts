import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "category_item" })
export class CategoryItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, type: "int" })
    itemId: number;

    @Column({ nullable: false, type: "int" })
    categoryId: number;
}

import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";
import { idColumn } from "jack-hermanson-ts-utils";

export class Items1624241326637 implements MigrationInterface {
    item = new Table({
        name: "item",
        columns: [
            idColumn,
            {
                name: "name",
                type: "varchar",
                isNullable: false,
            },
            {
                name: "checked",
                type: "boolean",
                isNullable: false,
                default: false,
            },
            {
                name: "notes",
                type: "varchar",
                isNullable: true,
            },
            {
                name: "updated",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
            },
            {
                name: "accountId",
                type: "int",
                isNullable: false,
            },
        ],
    });

    categoryItem = new Table({
        name: "category_item",
        columns: [
            idColumn,
            {
                name: "itemId",
                type: "int",
                isNullable: false,
            },
            {
                name: "categoryId",
                type: "int",
                isNullable: false,
            },
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.item, true);
        await queryRunner.createTable(this.categoryItem, true);
        await queryRunner.createForeignKeys(this.categoryItem, [
            new TableForeignKey({
                columnNames: ["categoryId"],
                referencedTableName: "category",
                referencedColumnNames: ["id"],
            }),
            new TableForeignKey({
                columnNames: ["itemId"],
                referencedTableName: "item",
                referencedColumnNames: ["id"],
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.categoryItem);
        await queryRunner.dropTable(this.item);
    }
}

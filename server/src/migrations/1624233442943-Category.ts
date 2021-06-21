import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { idColumn } from "jack-hermanson-ts-utils";

export class Category1624233442943 implements MigrationInterface {
    category = new Table({
        name: "category",
        columns: [
            idColumn,
            {
                name: "name",
                type: "varchar",
                isNullable: false,
                isUnique: true,
            },
            {
                name: "visible",
                type: "boolean",
                isNullable: false,
                default: true,
            },
            {
                name: "notes",
                type: "varchar",
                isNullable: true,
            },
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.category, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.category);
    }
}

import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { idColumn } from "jack-hermanson-ts-utils";

export class Accounts1624047684650 implements MigrationInterface {
    account = new Table({
        name: "account",
        columns: [
            idColumn,
            {
                name: "username",
                type: "varchar",
                isNullable: false,
                isUnique: true,
            },
            {
                name: "password",
                type: "varchar",
                isNullable: false,
            },
            {
                name: "token",
                type: "varchar",
                isNullable: true,
            },
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.account, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.account);
    }
}

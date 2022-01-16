import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from "typeorm";
import { idColumn } from "jack-hermanson-ts-utils";

export class Token1628565761450 implements MigrationInterface {
    token = new Table({
        name: "token",
        columns: [
            idColumn,
            {
                name: "data",
                type: "varchar",
                isNullable: false,
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

    tokenAccountId = new TableForeignKey({
        columnNames: ["accountId"],
        referencedTableName: "account",
        referencedColumnNames: ["id"],
    });

    oldAccountTokenId = new TableForeignKey({
        referencedTableName: "token",
        referencedColumnNames: ["id"],
        columnNames: ["tokenId"],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys("account", [this.oldAccountTokenId]);
        await queryRunner.dropColumn("account", "tokenId");
        await queryRunner.createTable(this.token);
        await queryRunner.createForeignKeys(this.token, [this.tokenAccountId]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKeys(this.token, [this.tokenAccountId]);
        await queryRunner.dropTable(this.token);
        await queryRunner.addColumn(
            "account",
            new TableColumn({
                name: "token",
                type: "int",
                isNullable: true,
                default: null,
            })
        );
        await queryRunner.createForeignKeys("account", [
            this.oldAccountTokenId,
        ]);
    }
}

import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ItemUpdatedSpelling1624642425896 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "item",
            "update",
            new TableColumn({
                name: "updated",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "item",
            "updated",
            new TableColumn({
                name: "updated",
                type: "timestamp",
                default: "CURRENT_TIMESTAMP",
            })
        );
    }
}

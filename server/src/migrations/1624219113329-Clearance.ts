import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";
import { Clearance } from "../../../shared/enums";

export class Clearance1624219113329 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "account",
            new TableColumn({
                name: "clearance",
                type: "int",
                isNullable: false,
                default: Clearance.NONE,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("account", "clearance");
    }
}

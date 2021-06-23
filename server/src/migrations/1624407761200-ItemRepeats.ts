import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ItemRepeats1624407761200 implements MigrationInterface {
    repeatsColumn = new TableColumn({
        name: "repeats",
        type: "boolean",
        isNullable: false,
        default: false,
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("item", this.repeatsColumn);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("item", this.repeatsColumn);
    }
}

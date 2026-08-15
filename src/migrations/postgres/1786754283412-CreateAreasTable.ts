import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAreasTable1786754283412 implements MigrationInterface {
    private tableName = "areas";

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.debug(`[Migration START]: ${this.constructor.name}`);

        try {
            await queryRunner.createTable(
                new Table({
                    name: this.tableName,
                    columns: [
                        {
                            name: "id",
                            type: "int",
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: "increment",
                            unsigned: true,
                        },
                        {
                            name: "name",
                            type: "varchar",
                            isNullable: false,
                        },
                        {
                            name: "latitude",
                            type: "decimal",
                            precision: 10,
                            scale: 8,
                            isNullable: false,
                        },
                        {
                            name: "longitude",
                            type: "decimal",
                            precision: 11,
                            scale: 8,
                            isNullable: false,
                        },
                        {
                            name: "radius",
                            type: "int",
                            isNullable: false,
                        },
                    ],
                }),
                true,
                true,
                true,
            );

            console.debug(`[Migration SUCCESS - up]: ${this.constructor.name}`);
        } catch (internalError) {
            console.error(
                `[Migration FAILURE - up]: ${this.constructor.name}`,
                internalError,
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        try {
            await queryRunner.dropTable(this.tableName, true, true, true);
            console.debug(
                `[Migration SUCCESS - down]: ${this.constructor.name}`,
            );
        } catch (internalError) {
            console.error(
                `[Migration FAILURE - down]: ${this.constructor.name}`,
                internalError,
            );
        }
    }
}

import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVehiclesTable1786754283413 implements MigrationInterface {
    private tableName = "vehicles";

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

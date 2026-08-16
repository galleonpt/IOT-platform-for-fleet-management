import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateTelemetryTable1786754283414 implements MigrationInterface {
    private tableName = "telemetry";

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
                            name: "recorded_at",
                            type: "timestamptz",
                            isPrimary: true,
                            isNullable: false,
                            default: "NOW()",
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
                            name: "vehicle_id",
                            type: "int",
                            unsigned: true,
                            isNullable: false,
                        },
                        {
                            name: "fuel",
                            type: "double precision",
                            isNullable: false,
                        },
                        {
                            name: "speed",
                            type: "double precision",
                            isNullable: false,
                        },
                        {
                            name: "engine_temperature",
                            type: "double precision",
                            isNullable: false,
                        },
                    ],
                }),
                true,
                true,
                true,
            );

            await queryRunner.createIndex(
                this.tableName,
                new TableIndex({
                    name: "telemetry_vehicle_id_recorded_at_idx",
                    columnNames: ["vehicle_id", "recorded_at"],
                    isUnique: false,
                }),
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

import { EntityTarget, Repository } from "typeorm";
import { timescaleClient } from "../../clients/timescale.client";
import { Telemetry } from "../../entities/telemetry.model";

export class TelemetryRepository {
    private entityClass: EntityTarget<Telemetry> = Telemetry;

    /**
     * Get the TypeORM repository for this entity using the primary Timescale client.
     *
     * @returns {Repository<Telemetry>} The TypeORM repository .
     */
    private get repository(): Repository<Telemetry> {
        return timescaleClient.getRepository(
            this.entityClass as EntityTarget<Telemetry>,
        );
    }

    /**
     * Saves a given Telemetry details.
     *
     * @param {Telemetry[]} entities The Telemetry details.
     *
     * @returns {Promise<Telemetry[]>} The save result.
     */
    public async save(entities: Telemetry[]): Promise<Telemetry[]> {
        return this.repository.save(entities);
    }

    /**
     * Retrieves the latest telemetry record for a given vehicle.
     *
     * @param {number} vehicleId The vehicle identifier.
     *
     * @returns {Promise<Telemetry | null>} The latest telemetry record or null if not found.
     */
    public async getLatestByVehicleId(
        vehicleId: number,
    ): Promise<Telemetry | null> {
        return this.repository.findOne({
            where: {
                vehicle_id: vehicleId,
            },
            order: { recorded_at: "DESC" },
        });
    }
}

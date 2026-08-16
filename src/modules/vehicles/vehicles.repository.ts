import { EntityTarget, Repository } from "typeorm";
import { postgresClient } from "../../clients/postgres.client";
import { Vehicle } from "../../entities/vehicle.model";

export class VehiclesRepository {
    private entityClass: EntityTarget<Vehicle> = Vehicle;

    /**
     * Get the TypeORM repository for this entity using the primary Postgres client.
     *
     * @returns {Repository<Vehicle>} The TypeORM repository .
     */
    private get repository(): Repository<Vehicle> {
        return postgresClient.getRepository(
            this.entityClass as EntityTarget<Vehicle>,
        );
    }

    /**
     * Saves a given Vehicle details.
     *
     * @param {Vehicle} entity The Vehicle details.
     *
     * @returns {Promise<Vehicle>} The save result.
     */
    public async save(entity: Vehicle): Promise<Vehicle> {
        return this.repository.save(entity);
    }

    /**
     * Retrieve all Vehicles from the system.
     *
     * @returns {Promise<Vehicle[]>} The save result.
     */
    public async getAll(): Promise<Vehicle[]> {
        return this.repository.find();
    }

    /**
     * Retrieve a vehicle by id.
     *
     * @returns {Promise<Vehicle | null>} The matched result.
     */
    public async getById(id: number): Promise<Vehicle | null> {
        return this.repository.findOneBy({ id });
    }
}

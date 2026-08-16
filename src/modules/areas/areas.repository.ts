import { EntityTarget, Repository } from "typeorm";
import { postgresClient } from "../../clients/postgres.client";
import { Area } from "../../entities/area.model";

export class AreasRepository {
    private entityClass: EntityTarget<Area> = Area;

    /**
     * Get the TypeORM repository for this entity using the primary Postgres client.
     *
     * @returns {Repository<Area>} The TypeORM repository .
     */
    private get repository(): Repository<Area> {
        return postgresClient.getRepository(
            this.entityClass as EntityTarget<Area>,
        );
    }

    /**
     * Saves a given Area details.
     *
     * @param {Area} entity The Area details.
     *
     * @returns {Promise<Area>} The save result.
     */
    public async save(entity: Area): Promise<Area> {
        return this.repository.save(entity);
    }

    /**
     * Retrieve all areas from the system.
     *
     * @returns {Promise<Area>} The save result.
     */
    public async getAll(): Promise<Area[]> {
        return this.repository.find();
    }

    /**
     * Retrieves a single area by its identifier.
     *
     * @param {number} areaId The area identifier.
     *
     * @returns {Promise<Area | null>} The area record or null if not found.
     */
    public async getById(areaId: number): Promise<Area | null> {
        return this.repository.findOneBy({ id: areaId });
    }
}

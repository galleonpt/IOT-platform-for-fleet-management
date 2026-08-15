import { validate } from "class-validator";
import { Request, Response } from "express";
import { Vehicle } from "../../entities/vehicle.model.ts";
import { CreateVehiclePayload } from "./vehicles.playloads.ts";
import { VehiclesRepository } from "./vehicles.repository.ts";

class VehiclesController {
    private readonly vehiclesRepository: VehiclesRepository;

    constructor() {
        this.vehiclesRepository = new VehiclesRepository();
    }

    createVehicle = async (request: Request, response: Response) => {
        try {
            // 1 - Validate payload
            const payload = Object.assign(
                new CreateVehiclePayload(),
                request.body,
            );
            const errors = await validate(payload);

            if (errors.length > 0) {
                return response.status(400).json({ errors });
            }

            // 2 - Create a new entity
            const vehicle = new Vehicle();
            vehicle.name = payload.name;

            const createdVehicle = await this.vehiclesRepository.save(vehicle);
            response.status(201).json(createdVehicle);
        } catch (error) {
            console.error("Error creating a vehicle.", error);
            response.status(500).json({ error: "Error creating a vehicle." });
        }
    };

    listVehicles = async (_request: Request, response: Response) => {
        try {
            const vehicles = await this.vehiclesRepository.getAll();
            response.status(200).json(vehicles);
        } catch (error) {
            console.error("Error listing vehicles.", error);
            response.status(500).json({ error: "Error listing vehicles." });
        }
    };
}

export default new VehiclesController();

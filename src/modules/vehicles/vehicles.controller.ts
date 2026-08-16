import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { Area } from "../../entities/area.model.ts";
import { Telemetry } from "../../entities/telemetry.model.ts";
import { Vehicle } from "../../entities/vehicle.model.ts";
import { calculateDistanceWithHaversine } from "../../utils/geo.utils.ts";
import { AreasRepository } from "../areas/areas.repository.ts";
import { TelemetryRepository } from "../ingestion/telemetry.repository.ts";
import { CreateVehiclePayload } from "./vehicles.playloads.ts";
import { VehiclesRepository } from "./vehicles.repository.ts";

class VehiclesController {
    private readonly vehiclesRepository: VehiclesRepository;
    private readonly telemetryRepository: TelemetryRepository;
    private readonly areasRepository: AreasRepository;

    constructor() {
        this.vehiclesRepository = new VehiclesRepository();
        this.telemetryRepository = new TelemetryRepository();
        this.areasRepository = new AreasRepository();
    }

    createVehicle = async (request: Request, response: Response) => {
        try {
            // 1 - Validate payload
            const payload: CreateVehiclePayload = plainToInstance(
                CreateVehiclePayload,
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

    checkIfVehicleIsInsideTheArea = async (
        request: Request,
        response: Response,
    ) => {
        try {
            const vehicleId = +request.params.vehicleId!;
            const areaId = +request.params.areaId!;

            // 1 - Get the vehicle details
            const vehicle: Vehicle | null =
                await this.vehiclesRepository.getById(vehicleId);

            if (!vehicle) {
                return response.status(404).json({
                    error: "Vehicle not found",
                });
            }

            // 1.2 - Get vehicle last location
            const lastestTelemetry: Telemetry | null =
                await this.telemetryRepository.getLatestByVehicleId(vehicle.id);

            if (!lastestTelemetry) {
                return response.status(404).json({
                    error: "No telemetry found",
                });
            }

            // 2 - Get the area details
            const area: Area | null =
                await this.areasRepository.getById(areaId);

            if (!area) {
                return response.status(404).json({
                    error: "Area not found",
                });
            }

            // User Haversine algorithm to check the distance between the latest location and the center of the given area
            const distance = calculateDistanceWithHaversine(
                {
                    latitude: lastestTelemetry.latitude,
                    longitude: lastestTelemetry.longitude,
                },
                {
                    latitude: area.latitude,
                    longitude: area.longitude,
                },
            );

            let isInsideArea = false;
            if (distance <= area.radius) {
                isInsideArea = true;
            }

            response.status(200).json({
                isInsideArea,
                vehicle,
                area,
            });
        } catch (error) {
            console.error(
                "Error checking if a vehicle is inside a specific area.",
                error,
            );
            response.status(500).json({
                error: "Error checking if a vehicle is inside a specific area",
            });
        }
    };
}

export default new VehiclesController();

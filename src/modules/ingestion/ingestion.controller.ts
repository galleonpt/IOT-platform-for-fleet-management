import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { Telemetry } from "../../entities/telemetry.model";
import {
    EngineTemperatureUnits,
    FuelUnits,
    SpeedUnits,
} from "./ingestion.enums";
import {
    IngestTelemetryPayload,
    TelemetryRecordData,
} from "./ingestion.payloads";
import { TelemetryRepository } from "./telemetry.repository";

class IngestionController {
    private readonly telemetryRepository: TelemetryRepository;

    constructor() {
        this.telemetryRepository = new TelemetryRepository();
    }

    addTelemetry = async (request: Request, response: Response) => {
        try {
            // 1 - Validate payload
            const payload = plainToInstance(
                IngestTelemetryPayload,
                request.body,
            );
            const errors = await validate(payload);

            if (errors.length > 0) {
                return response.status(400).json({ errors });
            }

            // 2 - Normalize data
            const data = this.normalizePayload(payload);

            // 3 - Save data
            await this.telemetryRepository.save(data);

            response.status(201).send();
        } catch (error) {
            console.error("Error adding telemtry.", error);
            response.status(500).json({ error: "Error adding telemtry." });
        }
    };

    /**
     * Normalize telemetry payload by converting units and mapping to Telemetry entities
     *
     * @param payload The incoming telemetry payload containing raw measurement data
     * @returns Array of normalized Telemetry entities ready for database storage
     */
    private normalizePayload = (
        payload: IngestTelemetryPayload,
    ): Telemetry[] => {
        const { data } = payload;

        const normalizedData =
            data.map<Telemetry>((telemetry: TelemetryRecordData) => {
                const fuel =
                    telemetry.fuel.unit === FuelUnits.GALLONS
                        ? this.convertGallonsToLiters(telemetry.fuel.value)
                        : telemetry.fuel.value;
                const speed =
                    telemetry.speed.unit === SpeedUnits.MILES
                        ? this.convertMilesInKm(telemetry.speed.value)
                        : telemetry.speed.value;
                const engineTemperature =
                    telemetry.engine_temperature.unit ===
                    EngineTemperatureUnits.FAHRENHEIT
                        ? this.convertFahrenitToCelcius(
                              telemetry.engine_temperature.value,
                          )
                        : telemetry.engine_temperature.value;

                const {
                    location: { latitude, longitude },
                } = telemetry;
                const newTelemetry = new Telemetry();
                newTelemetry.vehicle_id = payload.vehicle_id;
                newTelemetry.speed = speed;
                newTelemetry.fuel = fuel;
                newTelemetry.engine_temperature = engineTemperature;
                newTelemetry.latitude = latitude;
                newTelemetry.longitude = longitude;

                return newTelemetry;
            }) ?? [];

        return normalizedData;
    };

    /**
     * Convert miles to kilometers
     * @param value The value in miles
     * @returns The value converted to kilometers
     */
    private convertMilesInKm = (value: number): number => {
        return value * 1.60934;
    };

    /**
     * Convert gallons to liters
     * @param value The value in gallons
     * @returns The value converted to liters
     */
    private convertGallonsToLiters = (value: number): number => {
        return value * 3.78541;
    };

    /**
     * Convert Fahrenheit to Celsius
     * @param value The value in Fahrenheit
     * @returns The value converted to Celsius
     */
    private convertFahrenitToCelcius = (value: number): number => {
        return (value - 32) * (5 / 9);
    };
}

export default new IngestionController();

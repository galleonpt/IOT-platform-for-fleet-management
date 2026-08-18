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

class IngestionService {
    private readonly telemetryRepository: TelemetryRepository;

    constructor() {
        this.telemetryRepository = new TelemetryRepository();
    }

    normalizeRecord = (
        vehicleId: number,
        telemetry: TelemetryRecordData,
    ): Telemetry => {
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
            recorded_at,
        } = telemetry;
        const newTelemetry = new Telemetry();
        newTelemetry.vehicle_id = vehicleId;
        newTelemetry.speed = speed;
        newTelemetry.fuel = fuel;
        newTelemetry.engine_temperature = engineTemperature;
        newTelemetry.latitude = latitude;
        newTelemetry.longitude = longitude;
        newTelemetry.recorded_at = recorded_at;

        return newTelemetry;
    };

    ingestBatch = async (
        payload: IngestTelemetryPayload,
    ): Promise<Telemetry[]> => {
        const entities = payload.data.map((record) =>
            this.normalizeRecord(payload.vehicle_id, record),
        );
        return this.telemetryRepository.save(entities);
    };

    ingestSingle = async (
        vehicleId: number,
        record: TelemetryRecordData,
    ): Promise<Telemetry> => {
        const [saved] = await this.telemetryRepository.save([
            this.normalizeRecord(vehicleId, record),
        ]);
        return saved!;
    };

    private convertMilesInKm = (value: number): number => {
        return value * 1.60934;
    };

    private convertGallonsToLiters = (value: number): number => {
        return value * 3.78541;
    };

    private convertFahrenitToCelcius = (value: number): number => {
        return (value - 32) * (5 / 9);
    };
}

export default new IngestionService();

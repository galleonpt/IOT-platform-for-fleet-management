import { Type } from "class-transformer";
import {
    IsArray,
    IsDateString,
    IsEnum,
    IsLongitude,
    IsNotEmpty,
    IsNumber,
    ValidateNested,
} from "class-validator";
import { objectValuesToString } from "../../utils/strings.utils";
import {
    EngineTemperatureUnits,
    FuelUnits,
    SpeedUnits,
} from "./ingestion.enums";

export class FuelData {
    @IsNumber()
    value: number;

    @IsEnum(FuelUnits, {
        message: `Fuel unit is invalid. Must be one of ${objectValuesToString(FuelUnits)}`,
    })
    unit: FuelUnits;
}

export class SpeedData {
    @IsNumber()
    value: number;

    @IsEnum(SpeedUnits, {
        message: `Speed unit is invalid. Must be one of ${objectValuesToString(SpeedUnits)}`,
    })
    unit: SpeedUnits;
}

export class EngineTemperatureData {
    @IsNumber()
    value: number;

    @IsEnum(EngineTemperatureUnits, {
        message: `Engine temperature unit is invalid. Must be one of ${objectValuesToString(EngineTemperatureUnits)}`,
    })
    unit: EngineTemperatureUnits;
}

export class LocationData {
    @IsLongitude()
    @IsNumber()
    @IsNotEmpty({ message: "Longitude is required" })
    latitude: number;

    @IsLongitude()
    @IsNumber()
    @IsNotEmpty({ message: "Longitude is required" })
    longitude: number;
}

export class TelemetryRecordData {
    @IsDateString()
    recorded_at: Date;

    @ValidateNested()
    @Type(() => LocationData)
    location: LocationData;

    @ValidateNested()
    @Type(() => FuelData)
    fuel: FuelData;

    @ValidateNested()
    @Type(() => SpeedData)
    speed: SpeedData;

    @ValidateNested()
    @Type(() => EngineTemperatureData)
    engine_temperature: EngineTemperatureData;
}

export class IngestTelemetryPayload {
    @IsNumber()
    @IsNotEmpty({ message: "Vehicle identifier is required" })
    vehicle_id: number;

    @IsArray()
    @ValidateNested({ each: true, message: "Telemetry data is invalid." })
    @Type(() => TelemetryRecordData)
    data: TelemetryRecordData[];
}

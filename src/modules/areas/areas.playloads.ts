import {
    IsLatitude,
    IsLongitude,
    IsNotEmpty,
    IsNumber,
    MaxLength,
    MinLength,
} from "class-validator";

/**
 * The required fields to create an Area.
 *
 * @example {
 *    "name": "Braga",
 *    "lat": 41.5538,
 *    "lng": -8.4269,
 *    "radius": 1000
 * }
 */
export class CreateAreaPayload {
    @MaxLength(100)
    @MinLength(3)
    @IsNotEmpty({ message: "Area name is required" })
    name: string;

    @IsLatitude()
    @IsNumber()
    @IsNotEmpty({ message: "Latitude is required" })
    latitude: number;

    @IsLongitude()
    @IsNumber()
    @IsNotEmpty({ message: "Longitude is required" })
    longitude: number;

    @IsNumber()
    @IsNotEmpty({ message: "Radius is required" })
    radius: number;
}

import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

/**
 * The required fields to create a Vehicle.
 *
 * @example {
 *    "name": "Truck 123",
 * }
 */
export class CreateVehiclePayload {
    @MaxLength(100)
    @MinLength(3)
    @IsNotEmpty({ message: "Vehicle name is required" })
    name: string;
}

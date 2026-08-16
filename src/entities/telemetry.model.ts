import { Hypertable, TimeColumn } from "@vigillabs/timescale-db-typeorm";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("telemetry", { synchronize: false })
@Hypertable({})
export class Telemetry {
    @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
    id: number;

    @TimeColumn()
    recorded_at: Date;

    @Column({
        type: "int",
        name: "vehicle_id",
        unsigned: true,
        nullable: false,
    })
    vehicle_id: number;

    @Column({ type: "double precision", name: "fuel", nullable: false })
    fuel: number;

    @Column({ type: "double precision", name: "speed", nullable: false })
    speed: number;

    @Column({
        type: "double precision",
        name: "engine_temperature",
        nullable: false,
    })
    engine_temperature: number;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 8,
        name: "latitude",
        nullable: false,
    })
    latitude: number;

    @Column({
        type: "decimal",
        precision: 11,
        scale: 8,
        name: "longitude",
        nullable: false,
    })
    longitude: number;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("areas", { synchronize: false })
export class Area {
    @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
    id: number;

    @Column({ type: "varchar", nullable: false })
    name: string;

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

    @Column({
        type: "integer",
        name: "radius",
        nullable: false,
    })
    radius: number; // In meters
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("vehicles", { synchronize: false })
export class Vehicle {
    @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
    id: number;

    @Column({ type: "varchar", nullable: false })
    name: string;
}

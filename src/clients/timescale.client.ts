import { DataSource } from "typeorm";

export const timescaleClient = new DataSource({
    type: "postgres",
    host: process.env.TIMESCALE_HOST || "localhost",
    port: 5432,
    username: process.env.TIMESCALE_USER!,
    password: process.env.TIMESCALE_PASSWORD!,
    database: process.env.TIMESCALE_DB!,
    synchronize: false,
    logging: ["query", "info"],
    entities: ["src/entities/**/**.model.*"],
    migrations: ["src/migrations/timescale/*.ts"],
    migrationsTableName: "typeorm_migrations",
});

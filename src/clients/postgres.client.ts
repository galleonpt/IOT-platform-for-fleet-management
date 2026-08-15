import { DataSource } from "typeorm";

export const postgresClient = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: 5432,
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    synchronize: false,
    logging: ["query", "info"],
    entities: ["src/entities/**/**.model.*"],
    migrations: ["src/migrations/postgres/*.ts"],
    migrationsTableName: "typeorm_migrations",
});

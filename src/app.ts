import "reflect-metadata";
// organize-imports-ignore
import "dotenv/config";
import express from "express";
import { Migration } from "typeorm";
import { postgresClient } from "./clients/postgres.client.ts";
import { timescaleClient } from "./clients/timescale.client.ts";
import router from "./router.ts";

const app = express();

app.use(express.json());
app.use("/", router);

const startServer = async (): Promise<void> => {
    // 1 - Initialize databases clients.
    // Postgres
    await postgresClient.initialize();

    await postgresClient
        .runMigrations({ transaction: "all" })
        .then((migrations: Migration[]) =>
            console.info("Migrations successfully ran", { migrations }),
        )
        .catch((error: Error) =>
            console.error(
                "Error running migrations. Proceeding regardless.",
                error,
            ),
        );

    // Timescale
    await timescaleClient.initialize();

    await timescaleClient
        .runMigrations({ transaction: "all" })
        .then((migrations: Migration[]) =>
            console.info("Migrations successfully ran", { migrations }),
        )
        .catch((error: Error) =>
            console.error(
                "Error running migrations. Proceeding regardless.",
                error,
            ),
        );

    const PORT = process.env.PORT ?? 3333;
    app.listen(PORT, async () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
};

startServer();

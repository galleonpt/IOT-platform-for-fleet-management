import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import ingestionService from "./ingestion.service";
import { IngestTelemetryPayload } from "./ingestion.payloads";

class IngestionController {
    addTelemetry = async (request: Request, response: Response) => {
        try {
            const payload = plainToInstance(
                IngestTelemetryPayload,
                request.body,
            );
            const errors = await validate(payload);

            if (errors.length > 0) {
                return response.status(400).json({ errors });
            }

            await ingestionService.ingestBatch(payload);

            response.status(201).send();
        } catch (error) {
            console.error("Error adding telemtry.", error);
            response.status(500).json({ error: "Error adding telemtry." });
        }
    };
}

export default new IngestionController();

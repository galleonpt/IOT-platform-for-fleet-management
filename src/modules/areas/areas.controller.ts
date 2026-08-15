import { validate } from "class-validator";
import { Request, Response } from "express";
import { Area } from "../../entities/area.model.ts";
import { CreateAreaPayload } from "./areas.playloads.ts";
import { AreasRepository } from "./areas.repository.ts";

class AreaController {
    private readonly areasRepository: AreasRepository;

    constructor() {
        this.areasRepository = new AreasRepository();
    }

    createArea = async (request: Request, response: Response) => {
        try {
            // 1 - Validate payload
            const payload = Object.assign(
                new CreateAreaPayload(),
                request.body,
            );
            const errors = await validate(payload);

            if (errors.length > 0) {
                return response.status(400).json({ errors });
            }

            // 2 - Create a new entity
            const area = new Area();
            area.name = payload.name;
            area.latitude = payload.latitude;
            area.longitude = payload.longitude;
            area.radius = payload.radius;

            const createdArea = await this.areasRepository.save(area);
            response.status(201).json(createdArea);
        } catch (error) {
            console.error("Error creating an area.", error);
            response.status(500).json({ error: "Error creating an area." });
        }
    };

    listAreas = async (_request: Request, response: Response) => {
        try {
            const areas = await this.areasRepository.getAll();
            response.status(200).json(areas);
        } catch (error) {
            console.error("Error listing areas.", error);
            response.status(500).json({ error: "Error listing areas." });
        }
    };
}

export default new AreaController();

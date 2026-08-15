import { Router } from "express";
import areasController from "./modules/areas/areas.controller.ts";
import vehiclesController from "./modules/vehicles/vehicles.controller.ts";

const router: Router = Router();

// Areas
router.get("/areas", areasController.listAreas);
router.post("/areas", areasController.createArea);

// Vehicles
router.get("/vehicles", vehiclesController.listVehicles);
router.post("/vehicles", vehiclesController.createVehicle);

export default router;

import { Router } from "express";
import areasController from "./modules/areas/areas.controller.ts";
import ingestionController from "./modules/ingestion/ingestion.controller.ts";
import vehiclesController from "./modules/vehicles/vehicles.controller.ts";

const router: Router = Router();
const v1Router: Router = Router();

// Areas
v1Router.get("/areas", areasController.listAreas);
v1Router.post("/areas", areasController.createArea);

// Vehicles
v1Router.get("/vehicles", vehiclesController.listVehicles);
v1Router.post("/vehicles", vehiclesController.createVehicle);
v1Router.get(
    "/vehicles/:vehicleId/areas/:areaId",
    vehiclesController.checkIfVehicleIsInsideTheArea,
);

// Telemetry
v1Router.post("/ingestion", ingestionController.addTelemetry);

router.use("/v1", v1Router);

export default router;

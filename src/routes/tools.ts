import express from "express";

import { toolsController } from "../controllers/tools";

export const toolsRoutes = express.Router();

//GET
toolsRoutes.get("/extractFromMarmiton", toolsController.extractFromMarmiton);
import express from "express";
import extractFile from "../middleware/file";

import { tagController } from "../controllers/tag";

export const tagRoutes = express.Router();

//GET
tagRoutes.get("/", tagController.getTags);

//POST
tagRoutes.post("/", extractFile, tagController.writeTag);

//PUT
tagRoutes.put("/:id", tagController.updateTag);

//DELETE
tagRoutes.delete("/:id", tagController.deleteTag);
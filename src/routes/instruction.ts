import express from "express";

import { instructionController } from "../controllers/instruction"; 

export const instructionRoutes = express.Router();

//GET
instructionRoutes.get("/", instructionController.readInstructions);
instructionRoutes.get("/byRecipeID", instructionController.getByRecipeID);
instructionRoutes.get("/countForRecipe", instructionController.getInstructionCountForRecipe);
instructionRoutes.get("/byID", instructionController.getInstructionByID);

//POST
instructionRoutes.post("/", instructionController.writeInstruction);
instructionRoutes.post("/byIngredientName", instructionController.writeInstructionByIngredientName);

//PUT
instructionRoutes.put("/:id", instructionController.updateInstruction);

//DELETE
instructionRoutes.delete("/:id", instructionController.deleteInstruction);
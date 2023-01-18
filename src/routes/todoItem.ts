import express from "express";

import { todoItemController } from "../controllers/todoItem";

export const todoItemRoutes = express.Router();

//GET
todoItemRoutes.get("/", todoItemController.readTodoItems);

//POST
todoItemRoutes.post("/", todoItemController.writeTodoItem);
todoItemRoutes.post("/updateQuantity/:id", todoItemController.updateQuantity);

//PUT
todoItemRoutes.put("/:id", todoItemController.updateTodoItem);

//DELETE
todoItemRoutes.delete("/:id", todoItemController.deleteTodoItem);
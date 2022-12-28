import express from "express";

import checkAuth from "../middleware/check-auth";

import { todoItemController } from "../controllers/todoItem";

export const todoItemRoutes = express.Router();

//GET
todoItemRoutes.get("/", todoItemController.readTodoItems);

//POST
todoItemRoutes.post("/", checkAuth, todoItemController.writeTodoItem);
todoItemRoutes.post("/updateQuantity/:id", checkAuth, todoItemController.updateQuantity);

//PUT
todoItemRoutes.put("/:id", checkAuth, todoItemController.updateTodoItem);

//DELETE
todoItemRoutes.delete("/:id", checkAuth, todoItemController.deleteTodoItem);
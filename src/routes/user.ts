import express from "express";

import { userController } from "../controllers/user";

export const userRoutes = express.Router();

userRoutes.post("/signup", userController.createUser);
userRoutes.post("/login", userController.userLogin);
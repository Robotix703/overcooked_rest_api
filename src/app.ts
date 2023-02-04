import express from 'express';
import bodyParser from "body-parser";
import path from 'path';
import cors from 'cors';

import * as BDD from './BDD';
import { init } from "./initialization";

require('dotenv').config();

BDD.connectToDataBase()
.then(() => {
    console.log("BDD - Connectée");

    init();
})
.catch((error: Error) => {
    console.log("BDD - Erreur de connexion");
    console.error(error);
});

//Routes
import { ingredientRoutes } from "./routes/ingredients";
import { instructionRoutes } from "./routes/instruction";
import { recipeRoutes } from "./routes/recipe";
import { pantryRoutes } from "./routes/pantry";
import { mealRoutes } from "./routes/meal";
import { todoItemRoutes } from "./routes/todoItem";
import { debugRoutes } from './routes/debug';
import { checkAPIKey } from './apiKey';
import checkAuth from './middleware/check-auth';
import { tagRoutes } from './routes/tag';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/images", express.static(path.join("images")));

//Use routes
app.post("/api/login", (req: any, res: any) => {
    const result = checkAPIKey(req.body.apiKey as string);
    res.status(200).json(result);
});
app.use("/api/ingredient", checkAuth, ingredientRoutes);
app.use("/api/instruction", checkAuth, instructionRoutes);
app.use("/api/recipe", checkAuth, recipeRoutes);
app.use("/api/pantry", checkAuth, pantryRoutes);
app.use("/api/meal", checkAuth, mealRoutes);
app.use("/api/todoItem", checkAuth, todoItemRoutes);
app.use("/api/tag", checkAuth, tagRoutes);

if(process.env.ALLOWDEBUG == "true"){
    console.log("Debug allowed");
    app.use("/debug", checkAuth, debugRoutes);
}
else {
    console.log("No debug allowed");
}
module.exports = app;
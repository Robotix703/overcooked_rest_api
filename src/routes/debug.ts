import express from "express";
import { checkPantry, checkPlannedMeals } from "../worker/dailyCheck";
import checkTodoList from "../worker/checkTodoList";

import { resizeAll, resizeImage } from "../worker/tinypng";
import { registerIngredientsOnTodo } from "../worker/registerIngredientsOnTodo";
import { Todoist } from "../modules/todoist";

export const debugRoutes = express.Router();

//TinyPNG
debugRoutes.get("/resize", (req, res) => {
    resizeImage(req.query.filename as string);

    res.send("OK");
});
debugRoutes.get("/resizeAll", (req, res) => {
    resizeAll();

    res.send("OK");
});

//CheckTodoList
debugRoutes.get("/checkTodoList", (req, res) => {
    checkTodoList();

    res.send("OK");
});

//dailyCheck
debugRoutes.get("/checkPlannedMeals", (req, res) => {
    checkPlannedMeals();

    res.send("OK");
});
debugRoutes.get("/checkPantry", async (req, res) => {
    let message = await checkPantry();

    res.send(message);
});

//RegisterIngredientsOnTodo
debugRoutes.get("/registerIngredient", (req, res) => {
    registerIngredientsOnTodo.registerIngredient(req.query.ingredientID as string, req.query.ingredientName as string, parseInt(req.query.quantity as string), req.query.recipeName as string);

    res.send("OK");
});

//Todolist get project
debugRoutes.get("/todoistProject", (req, res) => {
    Todoist.getProjectID(req.query.name as string)
    .then(result => {
        res.json(result);
    })
    .catch((error : Error) => {
        res.status(500).send(error.message);
    });
});

//Todolist get items
debugRoutes.get("/todoistItems", (req, res) => {
    Todoist.getItemsInProjectByName(req.query.name as string)
    .then(result => {
        res.json(result);
    })
    .catch((error : Error) => {
        res.status(500).send(error.message);
    });
});

//Todolist add item
debugRoutes.post("/todoistAddItem", (req, res) => {
    Todoist.addItemsInProjectByName(
        req.body.name as string,
        req.body.text as string,
        req.body.description as string
    )
    .then(result => {
        res.json(result);
    })
    .catch((error : Error) => {
        res.status(500).send(error.message);
    });
});

//Todolist update item
debugRoutes.put("/todoistUpdateItem", (req, res) => {
    Todoist.updateItem(
        req.body.itemID as string,
        req.body.text as string,
        req.body.description as string
    )
    .then(result => {
        res.json(result);
    })
    .catch((error : Error) => {
        res.status(500).send(error.message);
    });
});

//Todolist delete item
debugRoutes.delete("/todoistDeleteItem", (req, res) => {
    Todoist.deleteItem(req.body.id)
    .then(result => {
        res.json(result);
    })
    .catch((error : Error) => {
        res.status(500).send(error.message);
    });
});
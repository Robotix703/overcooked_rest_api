import express from "express";
import checkTodoList from "../worker/checkTodoList";

import { resizeAll, resizeImage } from "../modules/tinypng";
import { registerIngredientsOnTodo } from "../worker/registerIngredientsOnTodo";
import { Todoist } from "../modules/todoist";
import { baseRecipe } from "../compute/base/recipe";
import { handleComposition } from "../compute/handleComposition";
import { donwloadFile, handleIngredientImage, handleRecipeImage } from "../modules/file";
import { removeBackgroundFromPath } from "../modules/removebg";
import { fetchData } from "../modules/webScrapping";

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

//RegisterIngredientsOnTodo
debugRoutes.get("/registerIngredient", (req, res) => {
    registerIngredientsOnTodo.registerIngredient(req.query.ingredientID as string, req.query.ingredientName as string, parseInt(req.query.quantity as string), req.query.recipeName as string, req.query.mealID as string);

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

//Compute all recipe composition
debugRoutes.get("/computeAllComposition", async (req, res) => {
    const allRecipes = await baseRecipe.getAllRecipes();
    const totalLength : number = allRecipes.length;
    let current = 1;

    for(let recipe of allRecipes){
        console.log(current + "/" + totalLength + " : " + recipe.title);
        await handleComposition.editComposition(recipe._id);
        current++;
    }
    res.json(totalLength);
});

//File download
debugRoutes.post("/downloadFile", async (req, res) => {
    const url = req.body.url as string;
    const filename = "images/temp/" + (req.body.filename as string) + ".png";

    await donwloadFile(url, filename, (err: Error) => {
        res.json(err);
        return;
    });
    res.json("OK");
});

//Handle Recipe Image
debugRoutes.post("/handleRecipeImage", async (req, res) => {
    const url = req.body.url as string;
    const recipeName = req.body.recipeName as string;

    const dest = await handleRecipeImage(url, recipeName);
    res.json(dest);
});

//remove bg
debugRoutes.post("/removeBG", async (req, res) => {
    const filePath = req.body.filePath as string;

    const result = await removeBackgroundFromPath(filePath)
    .catch((error : Error) => {
        res.status(500).send(error.message);
        return;
    });

    res.json(result);
});

//Handle Ingredient Image
debugRoutes.post("/handleIngredientImage", async (req, res) => {
    const url = req.body.url as string;
    const ingredientName = req.body.ingredientName as string;

    handleIngredientImage(url, ingredientName)
    .then(() => {
        res.json("OK");
    })
    .catch((error : Error) => {
        res.status(500).send(error.message);
    });
});

//WebScrapper
debugRoutes.get("/webScrapper", async (req, res) => {

    const webS = await fetchData(req.query.url as string);
    res.json(webS);
});
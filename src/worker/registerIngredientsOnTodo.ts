require('dotenv').config();
import { Todoist } from "../modules/todoist";

import { baseTodoItem } from "../compute/base/todoItem";
import { baseIngredient } from "../compute/base/ingredient";
import { handleTodoItem } from "../compute/handleTodoItem";
import { handleIngredient } from "../compute/handleIngredient";

import { ITodoItem } from "../models/todoItem";
import { IIngredient } from "../models/ingredient";
import { IIngredientWithQuantity } from "../compute/handleRecipe";

import { Task } from "@doist/todoist-api-typescript";

export function formatIngredient(ingredientName : string, ingredientUnitOfMeasure : string, ingredientQuantity : number) : string {
  return ingredientName + " - " + ingredientQuantity + " " + ingredientUnitOfMeasure;
}

export function handleUnderline(newRecipe: string, actualUnderline: string) : string{
  if(actualUnderline.search(newRecipe) != -1){
    return actualUnderline;
  }

  return actualUnderline + " - " + newRecipe;
}

export async function updateTodoItem(existingIngredient : ITodoItem, newIngredient : IIngredientWithQuantity, recipeName: string, mealID: string) : Promise<void> {
  const textSplit : string[] = existingIngredient.text.split(" - ");
  const quantity : number = existingIngredient.quantity;
  const underline : string = existingIngredient.underline;

  newIngredient.quantity += quantity;
  const ingredientText : string = formatIngredient(newIngredient.ingredient.name, newIngredient.ingredient.unitOfMeasure, newIngredient.quantity);

  const newUnderline : string = handleUnderline(recipeName, underline);
  let newMealID : string[] = existingIngredient.mealID;
  newMealID.push(mealID);

  await Todoist.updateItem(existingIngredient.todoID.toString(), ingredientText, newUnderline)
  .catch((error: Error) => {
    throw error;
  })
  await baseTodoItem.updateTodoItem(existingIngredient._id, existingIngredient.todoID, ingredientText, newIngredient.quantity, newIngredient.ingredient.name, existingIngredient.consumable, newMealID, newUnderline);
}

export async function addTodoItem(ingredient : IIngredientWithQuantity, consumable : boolean, recipeName: string, mealId: string) : Promise<any> {
  const ingredientText : string = formatIngredient(ingredient.ingredient.name, ingredient.ingredient.unitOfMeasure, ingredient.quantity);
  const todoItem : Task = await Todoist.addItemsInProjectByName(process.env.TODOPROJECT, ingredientText, recipeName)
  .catch((error: Error) => {
    throw error;
  })
  await baseTodoItem.registerTodoItem(
    todoItem.id.toString(), 
    ingredientText,
    ingredient.quantity,
    ingredient.ingredient.name, 
    consumable,
    [mealId],
    recipeName);
}

export namespace registerIngredientsOnTodo {
  
  export async function registerIngredients(ingredientList : IIngredientWithQuantity[], recipeName: string, mealID: string) : Promise<void> {
    for (const ingredient of ingredientList) {
      const existingIngredient : ITodoItem | void = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(ingredient.ingredient.name);
      const consumable : boolean = await handleIngredient.getConsumable(ingredient.ingredient._id);
  
      if(existingIngredient){
        await updateTodoItem(existingIngredient, ingredient, recipeName, mealID)
        .catch((error: Error) => {
          throw error;
        });
      }else{
        await addTodoItem(ingredient, consumable, recipeName, mealID)
        .catch((error: Error) => {
          throw error;
        });
      }
    }
  }
  
  export async function registerIngredient(ingredientID : string, ingredientName : string, quantity : number, recipeName: string, mealID: string) : Promise<void> {
    let existingIngredient : ITodoItem | void = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(ingredientName);
    let consumable : boolean = await handleIngredient.getConsumable(ingredientID);
    let ingredient : IIngredient = await baseIngredient.getIngredientByName(ingredientName);
  
    if(existingIngredient){
      await updateTodoItem(existingIngredient, { ingredient: ingredient, quantity: quantity }, recipeName, mealID);
    }else{
      await addTodoItem({ ingredient: ingredient, quantity: quantity }, consumable, recipeName, mealID)
      .catch((error: Error) => {
        throw error;
      })
    }
  }
}
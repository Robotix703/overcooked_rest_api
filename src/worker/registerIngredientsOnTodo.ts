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

export async function updateTodoItem(existingIngredient : ITodoItem, newIngredient : IIngredientWithQuantity, recipeName: string) : Promise<void> {
  const textSplit : string[] = existingIngredient.text.split(" - ");
  const quantity : string = textSplit[1].split(" ")[0];
  const underline : string = existingIngredient.underline;

  newIngredient.quantity += parseInt(quantity);
  const ingredientText : string = formatIngredient(newIngredient.ingredient.name, newIngredient.ingredient.unitOfMeasure, newIngredient.quantity);

  let newUnderline : string = handleUnderline(recipeName, underline);

  await Todoist.updateItem(existingIngredient.todoID, ingredientText, newUnderline);
  await baseTodoItem.updateTodoItem(existingIngredient._id, existingIngredient.todoID, ingredientText, newIngredient.ingredient.name, existingIngredient.consumable, newUnderline);
}

export async function addTodoItem(ingredient : IIngredientWithQuantity, consumable : boolean, recipeName: string) : Promise<any> {
  const ingredientText : string = formatIngredient(ingredient.ingredient.name, ingredient.ingredient.unitOfMeasure, ingredient.quantity);
  const todoItem : Task = await Todoist.addItemsInProjectByName(process.env.TODOPROJECT, ingredientText, recipeName);
  await baseTodoItem.registerTodoItem(
    todoItem.id.toString(), 
    ingredientText, 
    ingredient.ingredient.name, 
    consumable,
    recipeName);
}

export namespace registerIngredientsOnTodo {
  
  export async function registerIngredients(ingredientList : IIngredientWithQuantity[], recipeName: string) : Promise<void> {
    for (let ingredient of ingredientList) {
      let existingIngredient : ITodoItem | void = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(ingredient.ingredient.name);
      let consumable : boolean = await handleIngredient.getConsumable(ingredient.ingredient._id);
  
      if(existingIngredient){
        await updateTodoItem(existingIngredient, ingredient, recipeName);
      }else{
        await addTodoItem(ingredient, consumable, recipeName);
      }
    }
  }
  
  export async function registerIngredient(ingredientID : string, ingredientName : string, quantity : number, recipeName: string) : Promise<void> {
    let existingIngredient : ITodoItem | void = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(ingredientName);
    let consumable : boolean = await handleIngredient.getConsumable(ingredientID);
    let ingredient : IIngredient = await baseIngredient.getIngredientByName(ingredientName);
  
    if(existingIngredient){
      await updateTodoItem(existingIngredient, { ingredient: ingredient, quantity: quantity }, recipeName);
    }else{
      await addTodoItem({ ingredient: ingredient, quantity: quantity }, consumable, recipeName);
    }
  }
}
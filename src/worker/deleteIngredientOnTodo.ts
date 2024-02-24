import { ITodoistText, ITodoItem, parseItem } from "../models/todoItem";
import { IIngredientWithQuantity } from "../compute/handleRecipe";

import { baseTodoItem } from "../compute/base/todoItem";

import { Todoist } from "../modules/todoist";
import { IDeleteOne, IUpdateOne } from "../models/mongoose";



export namespace deleteIngredientsOnTodo {
    export async function deleteIngredient(ingredientWithQuantity: IIngredientWithQuantity, mealID: string) : Promise<void> {
        //TodoItem
        const todoItem : ITodoItem | void = await baseTodoItem.getTodoItemByIngredientName(ingredientWithQuantity.ingredient.name);
        if(!todoItem) {
            return;
        }
        
        //Delete todoItem
        if(todoItem.quantity == ingredientWithQuantity.quantity){
            await Todoist.deleteItem(todoItem.todoID.toString());

            const result : IDeleteOne = await baseTodoItem.deleteTodoItem(todoItem.todoID);
            if(result.deletedCount <= 0) throw new Error("Error when deleting todoitem");
        } 
        //Update todoItem
        else if(todoItem.quantity > ingredientWithQuantity.quantity) {
            const newQuantity : number = todoItem.quantity - ingredientWithQuantity.quantity;
            const newContent : string = todoItem.text.replace(todoItem.quantity.toString(), newQuantity.toString());
            const newMealID : string[] = todoItem.mealID.filter((e) => e != mealID);

            await Todoist.updateItem(todoItem.todoID.toString(), newContent);

            let result : IUpdateOne = await baseTodoItem.updateTodoItem(
                todoItem._id, 
                todoItem.todoID, 
                newContent, 
                newQuantity,
                ingredientWithQuantity.ingredient.name, 
                ingredientWithQuantity.ingredient.consumable,
                newMealID);

            if(result.modifiedCount <= 0) throw new Error("Error when update todoItem");
        } 
        //Error
        else {
            throw new Error("Error with quantity");
        }
    }
}
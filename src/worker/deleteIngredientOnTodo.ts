import { ITodoistText, ITodoItem, parseItem } from "../models/todoItem";
import { IIngredientWithQuantity } from "../compute/handleRecipe";

import { baseTodoItem } from "../compute/base/todoItem";

import { Todoist } from "../modules/todoist";
import { IDeleteOne, IUpdateOne } from "../models/mongoose";



export namespace deleteIngredientsOnTodo {
    export async function deleteIngredient(ingredientWithQuantity: IIngredientWithQuantity) : Promise<void> {
        //TodoItem
        const todoItem : ITodoItem | void = await baseTodoItem.getTodoItemByIngredientName(ingredientWithQuantity.ingredient.name);
        
        //TodoItem to update
        if(todoItem){
            const parsedTodoItem : ITodoistText = parseItem(todoItem.text);

            if(parsedTodoItem.ingredientName != ingredientWithQuantity.ingredient.name) throw new Error("Wrong ingredient");

            //Delete todoItem
            if(parsedTodoItem.quantity == ingredientWithQuantity.quantity){
                await Todoist.deleteItem(todoItem.todoID.toString());

                const result : IDeleteOne = await baseTodoItem.deleteTodoItem(todoItem.todoID);
                if(result.deletedCount <= 0 || !result.ok) throw new Error("Error when deleting todoitem");
            } 
            //Update todoItem
            else if(parsedTodoItem.quantity > ingredientWithQuantity.quantity) {
                const newQuantity : number = parsedTodoItem.quantity - ingredientWithQuantity.quantity;
                const newContent : string = todoItem.text.replace(parsedTodoItem.quantity.toString(), newQuantity.toString());

                await Todoist.updateItem(todoItem.todoID, newContent);

                let result : IUpdateOne = await baseTodoItem.updateTodoItem(
                    todoItem._id, 
                    todoItem.todoID, 
                    newContent, 
                    ingredientWithQuantity.ingredient.name, 
                    ingredientWithQuantity.ingredient.consumable);

                if(result.modifiedCount <= 0 || !result.ok) throw new Error("Error when update todoItem");
            } 
            //Error
            else {
                throw new Error("Error with quantity");
            }
        } else {
            //Nothing to do
        }
    }
}
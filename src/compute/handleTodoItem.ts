import { Todoist } from "../modules/todoist";
import { IUpdateOne } from "../models/mongoose";
import { ITodoistText, ITodoItem, parseItem, stringifyItem } from "../models/todoItem";

import { baseTodoItem } from "./base/todoItem";

export namespace handleTodoItem {
    export async function checkIfIngredientIsAlreadyInTodo(ingredientName : string) : Promise<ITodoItem | void> {
        return await baseTodoItem.getTodoItemByIngredientName(ingredientName);
    }

    export async function updateQuantity(todoItemId: string, newQuantity : number) : Promise<IUpdateOne> {
        let todoItem = await baseTodoItem.getTodoItemByID(todoItemId);

        let parsedItem : ITodoistText = parseItem(todoItem.text);
        parsedItem.quantity = newQuantity;
        let updatedText : string = stringifyItem(parsedItem.ingredientName, parsedItem.quantity, parsedItem.unitOfMeasure);

        let isUpdated = await Todoist.updateItem(todoItem.todoID, updatedText);

        if(isUpdated){
            return await baseTodoItem.updateTodoItem(
                todoItem._id,
                todoItem.todoID,
                updatedText,
                parsedItem.quantity,
                todoItem.ingredientName,
                todoItem.consumable,
                todoItem.mealID,
                todoItem.underline
            );
        }else{
            return {
                n: 0,
                modifiedCount: 0,
                ok: 0
            };
        }
    }
}
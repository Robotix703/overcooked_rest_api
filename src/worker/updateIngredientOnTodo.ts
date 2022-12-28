import { ITodoItem } from "../models/todoItem";
import { IIngredientWithQuantity } from "../compute/handleRecipe";
import { IUpdateOne } from "../models/mongoose";

import { baseTodoItem } from "../compute/base/todoItem";
import { Todoist, TodoistPriority } from "../modules/todoist";



export namespace updateIngredientsOnTodo {

    export async function setHighPrioIngredientWithQuantity(ingredientWithQuantity: IIngredientWithQuantity) : Promise<void> {
        //TodoItem
        let todoItem : ITodoItem | void = await baseTodoItem.getTodoItemByIngredientName(ingredientWithQuantity.ingredient.name);
        
        //TodoItem to update
        if(todoItem){
            await Todoist.updateItem(todoItem.todoID, todoItem.text, todoItem.underline, TodoistPriority.VeryHigh);

            let result : IUpdateOne = await baseTodoItem.updateTodoItem(
                todoItem._id, 
                todoItem.todoID,
                todoItem.text,
                todoItem.ingredientName,
                todoItem.consumable,
                todoItem.underline,
                TodoistPriority.VeryHigh);

            if(result.modifiedCount <= 0 || !result.ok) throw new Error("Error when update todoItem");
        } else {
            //Nothing to do
        }
    }
}
import { IDeleteOne, IUpdateOne } from "../../models/mongoose";
import TodoItem, { ITodoItem } from "../../models/todoItem";

export namespace baseTodoItem {

    export async function getTodoItemByIngredientName(ingredientName : string) : Promise<ITodoItem | void> {
        return TodoItem.findOne({ingredientName: ingredientName});
    }

    export async function updateTodoItem(
        todoItemID : string, 
        todoID : string, 
        text : string,
        quantity : number,
        ingredientName : string, 
        consumable: boolean,
        mealID: string[],
        underline?: string
        ) : Promise<IUpdateOne>
        {
        let todoItem = new TodoItem({
            _id: todoItemID,
            todoID: todoID,
            text: text,
            quantity: quantity,
            ingredientName: ingredientName,
            consumable: consumable,
            mealID: mealID
        });
        if(underline) todoItem.underline = underline;

        return TodoItem.updateOne({_id: todoItem._id}, todoItem);
    }

    export async function readTodoItems() : Promise<ITodoItem[]> {
        return TodoItem.find();
    }

    export async function deleteTodoItem(todoItemID : string) : Promise<IDeleteOne> {
        return TodoItem.deleteOne({ todoID: todoItemID });
    }
    export async function deleteTodoItemByID(id : string) : Promise<IDeleteOne> {
        return TodoItem.deleteOne({ _id: id });
    }

    export async function getTodoItemByID(todoItemID : string) : Promise<ITodoItem> {
        return TodoItem.findById(todoItemID);
    }

    export async function registerTodoItem(
        itemID : string, 
        itemText : string,
        quantity : number,
        name : string, 
        consumable : boolean,
        mealID: string[],
        underline?: string) : Promise<any> {
        const todoItem = new TodoItem({
            todoID: itemID,
            text: itemText,
            quantity: quantity,
            ingredientName: name,
            consumable: consumable,
            mealID: mealID
        });
        if(underline) todoItem.underline = underline;
    
        return todoItem.save();
    }

    export async function count() : Promise<number> {
        return TodoItem.count();
    }
}
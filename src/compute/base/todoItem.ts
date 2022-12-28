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
        ingredientName : string, 
        consumable: boolean,
        underline?: string,
        priority?: number
        ) : Promise<IUpdateOne>
        {
        let todoItem = new TodoItem({
            _id: todoItemID,
            todoID: todoID,
            text: text,
            ingredientName: ingredientName,
            consumable: consumable
        });
        if(underline) todoItem.underline = underline;
        if(priority) todoItem.priority = priority;

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
        name : string, 
        consumable : boolean,
        underline?: string,
        priority?: number) : Promise<any> {
        const todoItem = new TodoItem({
            todoID: itemID,
            text: itemText,
            ingredientName: name,
            consumable: consumable
        });
        if(underline) todoItem.underline = underline;
        if(priority) todoItem.priority = priority;
    
        return todoItem.save();
    }

    export async function count() : Promise<number> {
        return TodoItem.count();
    }
}
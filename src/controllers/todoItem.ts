import { Request, Response } from "express";
import { ITodoItem } from "../models/todoItem";
import { IDeleteOne, IUpdateOne } from "../models/mongoose";
import { BackendError, errorTypes, IBackendError } from "../error/backendError";

import { baseTodoItem } from "../compute/base/todoItem";
import { Todoist } from "../modules/todoist";

import { handleTodoItem } from "../compute/handleTodoItem";

export namespace todoItemController {
  export async function readTodoItems(req: Request, res: Response) {
    let fetchedTodoItems: ITodoItem[] | void = await baseTodoItem.readTodoItems()
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        });
        return;
      });

    let count: number | void = await baseTodoItem.count()
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        });
        return;
      });

    let data = {
      todoItems: fetchedTodoItems,
      count: count
    }
    res.status(200).json(data);
  }

  export async function updateQuantity(req: Request, res: Response) {
    if (req.params.id) {
      if (req.body.quantity) {
        let result: IUpdateOne = await handleTodoItem.updateQuantity(req.params.id, req.body.quantity);

        if (result.modifiedCount > 0) {
          res.status(200).json("OK");
        }
        else res.status(500).json(new BackendError(errorTypes.TodoItem, "Update didn't work").display())
      }
      else res.status(400).json(new BackendError(errorTypes.TodoItem, "Quantity not provided").display());
    }
    else res.status(400).json(new BackendError(errorTypes.TodoItem, "ID not provided").display());
  }

  export async function updateTodoItem(req: Request, res: Response) {
    let updateResult: IUpdateOne | void = await baseTodoItem.updateTodoItem(
      req.params.id,
      req.body.todoID,
      req.body.text,
      req.body.quantity,
      req.body.ingredientName,
      req.body.consumable,
      req.body.mealID,
      req.body.underline
    )
      .catch((error: Error) => {
        res.status(500).json({
          errorMessage: error
        });
        return;
      });

    if (updateResult) {
      if (updateResult.modifiedCount > 0) {
        let result: boolean | void = await Todoist.updateItem(req.body.todoID, req.body.text)
          .catch((error: Error) => {
            res.status(500).json({
              errorMessage: error
            });
            return;
          });

        if (result) {
          res.status(200).json({ status: "Ok" });
        }
        else {
          res.status(500).json({ message: "Problem with todoist" });
        }
      } else {
        res.status(401).json({ message: "Pas de modification" });
      }
    }
    else {
      res.status(500).json({
        errorMessage: "Update failed"
      });
    }
  }

  export async function deleteTodoItem(req: Request, res: Response) {
    const todoItem: ITodoItem | void = await baseTodoItem.getTodoItemByID(req.params.id)
      .catch((error: Error | IBackendError) => {
        if ("backendError" in error) res.status(500).json(error.display());
        else res.status(500).json(new BackendError(errorTypes.TodoItem, error.message).display());
        return;
      });

    if (todoItem) {
      const deleteResult: IDeleteOne | void = await baseTodoItem.deleteTodoItemByID(req.params.id)
        .catch((error: Error | IBackendError) => {
          if ("backendError" in error) res.status(500).json(error.display());
          else res.status(500).json(new BackendError(errorTypes.TodoItem, error.message).display());
          return;
        });

      if (deleteResult) {
        if (deleteResult.deletedCount > 0) {
          const result: boolean | void = await Todoist.deleteItem(todoItem.todoID.toString())
            .catch((error: Error | IBackendError) => {
              if ("backendError" in error) res.status(500).json(error.display());
              else res.status(500).json(new BackendError(errorTypes.Todoist, error.message).display());
              return;
            });
          if (result) {
            res.status(200).json({ status: "Ok" });
          }
        }
      }
    } 
  }
}
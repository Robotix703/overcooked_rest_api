const baseTodoItem = require("../../build/compute/base/todoItem").baseTodoItem;
const Todoist = require("../../build/modules/todoist").Todoist;

const handleTodoItem = require("../../build/compute/handleTodoItem").handleTodoItem;

let todoItem = {
    _id: "string",
    todoID: 10,
    text: "pomme - 2 pc",
    ingredientName: "ingredientName",
    consumable: true,
    underline: "underline"
}

let updated = {
    n: 1,
    modifiedCount: 1,
    ok: 1
}
let notUpdated = {
    n: 0,
    modifiedCount: 0,
    ok: 0
}

test('getIngredientIDFromInstruction', async () => {
    let getTodoItemByIngredientNameSpy = jest.spyOn(baseTodoItem, "getTodoItemByIngredientName").mockImplementationOnce(() => {
        return [todoItem];
    });
    
    let result = await handleTodoItem.checkIfIngredientIsAlreadyInTodo(todoItem.ingredientName);

    expect(getTodoItemByIngredientNameSpy).toHaveBeenCalledWith(todoItem.ingredientName);
    expect(JSON.parse(JSON.stringify(result))).toMatchObject([todoItem]);
});

test('updateQuantity', async () => {
    let getTodoItemByIDSpy = jest.spyOn(baseTodoItem, "getTodoItemByID").mockImplementationOnce(() => {
        return todoItem;
    });
    let updateItemSpy = jest.spyOn(Todoist, "updateItem").mockImplementationOnce(() => {
        return true;
    });
    let updateTodoItemSpy = jest.spyOn(baseTodoItem, "updateTodoItem").mockImplementationOnce(() => {
        return updated;
    });
    
    let result = await handleTodoItem.updateQuantity(todoItem._id, 10);

    expect(getTodoItemByIDSpy).toHaveBeenCalledWith(todoItem._id);
    expect(updateItemSpy).toHaveBeenCalledWith(todoItem.todoID, "pomme - 10 pc");
    expect(updateTodoItemSpy).toHaveBeenCalledWith(
        todoItem._id,
        todoItem.todoID,
        "pomme - 10 pc",
        10,
        todoItem.ingredientName,
        todoItem.consumable,
        undefined,
        todoItem.underline
    );
    expect(JSON.parse(JSON.stringify(result))).toMatchObject(updated);
});
test('updateQuantity with error on todoist', async () => {
    let getTodoItemByIDSpy = jest.spyOn(baseTodoItem, "getTodoItemByID").mockImplementationOnce(() => {
        return todoItem;
    });
    let updateItemSpy = jest.spyOn(Todoist, "updateItem").mockImplementationOnce(() => {
        return false;
    });
    
    let result = await handleTodoItem.updateQuantity(todoItem._id, "10");

    expect(getTodoItemByIDSpy).toHaveBeenCalledWith(todoItem._id);
    expect(updateItemSpy).toHaveBeenCalledWith(todoItem.todoID, "pomme - 10 pc");

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(notUpdated);
});
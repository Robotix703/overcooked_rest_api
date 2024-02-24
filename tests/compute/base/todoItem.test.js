const mockingoose = require('mockingoose');

const TodoItem = require("../../../build/models/todoItem").default;
const baseTodoItem = require("../../../build/compute/base/todoItem").baseTodoItem;

let todoItem = {
    _id: "62aef9168a09e75f44fac2e8",
    todoID: 10,
    text: "text",
    quantity: 10,
    ingredientName: "ingredientName",
    consumable: true,
    underline: "underline"
}

test('getTodoItemByIngredientName', async () => {
    mockingoose(TodoItem).toReturn(todoItem, 'findOne');

    let result = await baseTodoItem.getTodoItemByIngredientName(todoItem.ingredientName);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(todoItem);
});

test('updateTodoItem', async () => {
    mockingoose(TodoItem).toReturn("OK", 'updateOne');

    let result = await baseTodoItem.updateTodoItem(
        todoItem._id,
        todoItem.todoID,
        todoItem.text,
        todoItem.ingredientName,
        todoItem.consumable,
        todoItem.underline
    );

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('readTodoItems', async () => {
    mockingoose(TodoItem).toReturn(todoItem, 'find');

    let result = await baseTodoItem.readTodoItems();

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(todoItem);
});

test('deleteTodoItem', async () => {
    mockingoose(TodoItem).toReturn("OK", 'deleteOne');

    let result = await baseTodoItem.deleteTodoItem();

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('getTodoItemByID', async () => {
    mockingoose(TodoItem).toReturn(todoItem, 'findOne');

    let result = await baseTodoItem.getTodoItemByID(todoItem._id);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(todoItem);
});

test('registerTodoItem', async () => {
    mockingoose(TodoItem).toReturn(todoItem, 'save');

    let result = await baseTodoItem.registerTodoItem(
        todoItem.todoID,
        todoItem.text,
        todoItem.quantity,
        todoItem.ingredientName,
        todoItem.consumable,
        [],
        todoItem.underline
    );

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(todoItem);
});

test('count', async () => {
    mockingoose(TodoItem).toReturn(10, 'count');

    let result = await baseTodoItem.count();

    expect(JSON.parse(JSON.stringify(result))).toBe(10);
});
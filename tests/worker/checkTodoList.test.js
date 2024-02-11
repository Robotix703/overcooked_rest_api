const checkTodoListFile = require("../../build/worker/checkTodoList");

const baseIngredient = require("../../build/compute/base/ingredient").baseIngredient;
const basePantry = require("../../build/compute/base/pantry").basePantry;

const checkTodoList = checkTodoListFile.default;

const addDays = checkTodoListFile.addDays;
const addIngredientToPantry = checkTodoListFile.addIngredientToPantry;

let ingredient = {
    _id: '507f191e810c19729de860ea',
    name: "name",
    imagePath: "imagePath",
    consumable: true,
    category: "category",
    unitOfMeasure: "unitOfMeasure"
}

let todoItem = {
    _id: "string",
    todoID: 10,
    text: "text",
    ingredientName: "ingredientName",
    consumable: true
}

test('addDays', async () => {
    let date1 = new Date("15/02/1957");
    let date2 = new Date("18/02/1957");

    let result = addDays(date1, 3);

    expect(result.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }))
    .toBe(date2.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }));
});

test('addIngredientToPantry', async () => {
    let itemText = "ingredientName - 5";
    let date = new Date();

    let spy = jest.spyOn(baseIngredient, "getIngredientByName").mockResolvedValue(
        ingredient
    );
    let spy2 = jest.spyOn(basePantry, "register").mockResolvedValue(
        "OK"
    );

    await addIngredientToPantry(itemText);

    expect(spy).toHaveBeenCalledWith("ingredientName");
    expect(spy2.mock.calls[0][0]).toBe(ingredient._id);
    expect(spy2.mock.calls[0][1]).toBe(5);

    spy.mockRestore();
    spy2.mockRestore();
});
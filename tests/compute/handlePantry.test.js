const handlePantry = require("../../build/compute/handlePantry").handlePantry;

const basePantry = require("../../build/compute/base/pantry").basePantry;
const baseIngredient = require("../../build/compute/base/ingredient").baseIngredient;
const registerIngredientsOnTodo = require("../../build/worker/registerIngredientsOnTodo").registerIngredientsOnTodo;

let date = new Date();
date.setDate(date.getDate() + 2);

let pantry = {
    _id: "string",
    ingredientID: "ingredientID",
    quantity: 1,
    expirationDate: date,
    frozen: false
}
let pantry2 = {
    _id: "string2",
    ingredientID: "ingredientID2",
    quantity: 2,
    expirationDate: new Date(),
    frozen: false
}
let pantry3 = {
    _id: "string3",
    ingredientID: "ingredientID2",
    quantity: 2,
    expirationDate: null,
    frozen: true
}
let pantry4 = {
    _id: "string",
    ingredientID: "ingredientID",
    quantity: 1,
    expirationDate: date,
    frozen: false
}

let ingredient = {
    _id: '507f191e810c19729de860ea',
    name: "name",
    imagePath: "imagePath",
    consumable: true,
    category: "category",
    unitOfMeasure: "unitOfMeasure",
    shelfLife: 10,
    freezable: true
}

test('freezePantry', async () => {
    let getByIDSpy = jest.spyOn(basePantry, "getByID").mockImplementationOnce(() => {
        return pantry;
    });

    let updatePantryWithPantrySpy = jest.spyOn(basePantry, "updatePantryWithPantry").mockImplementationOnce(() => {
        return "OK";
    });
    
    let result = await handlePantry.freezePantry(pantry._id);

    expect(getByIDSpy).toHaveBeenCalledWith(pantry._id);
    expect(updatePantryWithPantrySpy).toHaveBeenCalledWith(pantry);
    expect(result).toBe("OK");
});

test('checkPantryExpiration with expiration date correct', async () => {
    let getAllPantryWithExpirationDateSpy = jest.spyOn(basePantry, "getAllPantryWithExpirationDate").mockImplementationOnce(() => {
        return [pantry4];
    });

    let deletePantryByIDSpy = jest.spyOn(basePantry, "deletePantryByID").mockImplementationOnce(() => {
        return "OK";
    });

    let getIngredientNameByIDSpy = jest.spyOn(baseIngredient, "getIngredientNameByID").mockImplementationOnce(() => {
        return "ingredientName";
    });
    
    let result = await handlePantry.checkPantryExpiration();

    expect(getAllPantryWithExpirationDateSpy).toHaveBeenCalledTimes(1);
    expect(deletePantryByIDSpy).toHaveBeenCalledTimes(0);
    expect(getIngredientNameByIDSpy).toHaveBeenCalledWith(pantry.ingredientID);
    expect(JSON.parse(JSON.stringify(result))).toMatchObject([{
        ingredientName: "ingredientName",
        quantity: pantry.quantity,
        expirationDate: date.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })
    }]);

    getAllPantryWithExpirationDateSpy.mockRestore();
    deletePantryByIDSpy.mockRestore();
    getIngredientNameByIDSpy.mockRestore();
});

test('checkPantryExpiration with expiration date too short', async () => {
    let getAllPantryWithExpirationDateSpy = jest.spyOn(basePantry, "getAllPantryWithExpirationDate").mockImplementationOnce(() => {
        return [pantry2];
    });

    let deletePantryByIDSpy = jest.spyOn(basePantry, "deletePantryByID").mockImplementationOnce(() => {
        return "OK";
    });

    let getIngredientByIDSpy = jest.spyOn(baseIngredient, "getIngredientByID").mockImplementationOnce(() => {
        return ingredient;
    });

    let registerIngredientsSpy = jest.spyOn(registerIngredientsOnTodo, "registerIngredient").mockImplementationOnce(() => {
        return;
    });

    let result = await handlePantry.checkPantryExpiration();

    expect(getAllPantryWithExpirationDateSpy).toHaveBeenCalled();
    expect(deletePantryByIDSpy).toHaveBeenCalledTimes(1);

    getAllPantryWithExpirationDateSpy.mockRestore();
    deletePantryByIDSpy.mockRestore();
    getIngredientByIDSpy.mockRestore();
    registerIngredientsSpy.mockRestore();
});

test('checkPantryExpiration without expiration date', async () => {
    let getAllPantryWithExpirationDateSpy = jest.spyOn(basePantry, "getAllPantryWithExpirationDate").mockImplementationOnce(() => {
        return [pantry3];
    });

    let deletePantryByIDSpy = jest.spyOn(basePantry, "deletePantryByID").mockImplementationOnce(() => {
        return "OK";
    });
    
    let result = await handlePantry.checkPantryExpiration();

    expect(getAllPantryWithExpirationDateSpy).toHaveBeenCalled();
    expect(deletePantryByIDSpy).toHaveBeenCalledTimes(0);

    getAllPantryWithExpirationDateSpy.mockRestore();
    deletePantryByIDSpy.mockRestore();
});
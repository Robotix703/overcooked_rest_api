const pantryFile = require("../../build/compute/pantryInventory");
const pantryInventory = pantryFile.PantryInventory;

const getConsumableID = pantryFile.getConsumableID;
const getInventoryForIngredientID = pantryFile.getInventoryForIngredientID;

const baseIngredient = require("../../build/compute/base/ingredient").baseIngredient;
const basePantry = require("../../build/compute/base/pantry").basePantry;

let ingredient = {
    _id: "string",
    name: "name",
    imagePath: "imagePath",
    consumable: true,
    category: "category",
    unitOfMeasure: "unitOfMeasure",
    shelfLife: 10
}
let ingredient2 = {
    _id: "string2",
    name: "name2",
    imagePath: "imagePath2",
    consumable: true,
    category: "category2",
    unitOfMeasure: "unitOfMeasure2",
    shelfLife: 12
}

let date = new Date();
date.setDate(date.getDate() + 1);
let pantry = {
    _id: "string",
    ingredientID: "ingredientID",
    quantity: 1,
    expirationDate: date
}
let pantry2 = {
    _id: "string2",
    ingredientID: "ingredientID",
    quantity: 2,
    expirationDate: new Date("12/12/12")
}

let pantryStatus = {
    quantityLeft: 3,
    nearestExpirationDate: "12/12/2012"
}

test('getConsumableID', async () => {
    jest.spyOn(baseIngredient, "getConsumableIngredients").mockImplementationOnce(() => {
        return [ingredient, ingredient2];
    });
    
    let result = await getConsumableID();

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([
        ingredient._id,
        ingredient2._id
    ]);
});

test('getInventoryForIngredientID', async () => {
    jest.spyOn(basePantry, "getAllPantryByIngredientID").mockImplementationOnce(() => {
        return [pantry, pantry2];
    });
    
    let result = await getInventoryForIngredientID(pantry.ingredientID);

    let object = JSON.parse(JSON.stringify(result));
    object.nearestExpirationDate = new Date(object.nearestExpirationDate).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" });

    expect(object).toMatchObject({
        quantityLeft: 3,
        nearestExpirationDate: "12/12/2012"
    });
});

test('getInventory', async () => {
    jest.spyOn(baseIngredient, "getConsumableIngredients").mockImplementationOnce(() => {
        return [ingredient];
    });

    jest.spyOn(basePantry, "getAllPantryByIngredientID").mockImplementationOnce(() => {
        return [pantry, pantry2];
    });
    
    let result = await pantryInventory.getInventory();

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([{
        ingredientID: ingredient._id,
        quantityLeft: pantryStatus.quantityLeft
    }]);
});

test('getInventory', async () => {
    jest.spyOn(basePantry, "getAllPantries").mockImplementationOnce(() => {
        return [pantry, pantry2];
    });

    jest.spyOn(baseIngredient, "getIngredientByID").mockImplementationOnce(() => {
        return ingredient;
    });
    
    let result = await pantryInventory.getFullInventory();

    let object = JSON.parse(JSON.stringify(result));

    expect(object[0].ingredientID).toBe(pantry.ingredientID);
    expect(object[0].ingredientName).toBe(ingredient.name);
    expect(object[0].ingredientImagePath).toBe(ingredient.imagePath);
    expect(object[0].pantries.length).toBe(2);
});
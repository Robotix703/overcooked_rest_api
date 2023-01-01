const updatePantryFile = require("../../build/compute/updatePantryWhenMealIsDone");

const comparePantriesByQuantity = updatePantryFile.comparePantriesByQuantity;
const comparePantriesByExpirationDate = updatePantryFile.comparePantriesByExpirationDate;
const consumeIngredientFromPantry = updatePantryFile.consumeIngredientFromPantry;

const basePantry = require("../../build/compute/base/pantry").basePantry;
const baseMeal = require("../../build/compute/base/meal").baseMeal;
const baseRecipe = require("../../build/compute/base/recipe").baseRecipe;
const handleComposition = require("../../build/compute/handleComposition").handleComposition;
const updatePantryWhenMealIsDone = updatePantryFile.updatePantryWhenMealIsDone;

let date = new Date();
date.setDate(date.getDate() + 1);
let pantry = {
    _id: "62bc94b4a969443c312272df",
    ingredientID: "ingredientID",
    quantity: 1,
    expirationDate: date,
    frozen: false
}
let pantry2 = {
    _id: "62bc94b4a969443c312272df",
    ingredientID: "ingredientID2",
    quantity: 2,
    expirationDate: new Date(),
    frozen: true
}
let pantry3 = {
    _id: "string2",
    ingredientID: "ingredientID2",
    quantity: 2,
    expirationDate: null,
    frozen: true
}

let meal = {
    _id: "date",
    recipeID: "recipeID",
    numberOfLunchPlanned: 1
}

let ingredientWithQuantity = {
    ingredient: {
        _id: "string",
        name: "name",
        imagePath: "imagePath",
        consumable: true,
        category: "category",
        unitOfMeasure: "unitOfMeasure",
        shelfLife: 10,
        freezable: false
    },
    quantity: 2
}

test('getIngredientIDFromInstruction', () => {
    
    expect(comparePantriesByQuantity(pantry, pantry2)).toBe(-1);
    expect(comparePantriesByQuantity(pantry2, pantry)).toBe(1);
});

test('comparePantriesByExpirationDate', () => {
    
    expect(comparePantriesByExpirationDate(pantry, pantry2)).toBe(-1);
    expect(comparePantriesByExpirationDate(pantry2, pantry)).toBe(1);
    expect(comparePantriesByExpirationDate(pantry, pantry3)).toBe(-1);
    expect(comparePantriesByExpirationDate(pantry3, pantry)).toBe(1);
    expect(comparePantriesByExpirationDate(pantry3, pantry3)).toBe(0);
});

test('consumeIngredientFromPantry with quantityToConsume > left', async () => {
    let getAllPantryByIngredientIDSpy = jest.spyOn(basePantry, "getAllPantryByIngredientID").mockImplementationOnce(() => {
        return [pantry];
    });

    let deletePantryByIDSpy = jest.spyOn(basePantry, "deletePantryByID").mockImplementationOnce(() => {
        return "OK";
    });
    
    await consumeIngredientFromPantry(pantry.ingredientID, 2);

    expect(getAllPantryByIngredientIDSpy).toHaveBeenCalledWith(pantry.ingredientID);
    expect(deletePantryByIDSpy).toHaveBeenCalledWith(pantry._id);
});

test('consumeIngredientFromPantry with quantityToConsume = left', async () => {
    let getAllPantryByIngredientIDSpy = jest.spyOn(basePantry, "getAllPantryByIngredientID").mockImplementationOnce(() => {
        return [pantry];
    });

    let deletePantryByIDSpy = jest.spyOn(basePantry, "deletePantryByID").mockImplementationOnce(() => {
        return "OK";
    });
    
    await consumeIngredientFromPantry(pantry.ingredientID, 1);

    expect(getAllPantryByIngredientIDSpy).toHaveBeenCalledWith(pantry.ingredientID);
    expect(deletePantryByIDSpy).toHaveBeenCalledWith(pantry._id);
});

test('consumeIngredientFromPantry with quantityToConsume < left', async () => {
    let getAllPantryByIngredientIDSpy = jest.spyOn(basePantry, "getAllPantryByIngredientID").mockImplementationOnce(() => {
        return [pantry2];
    });

    let deletePantryByIDSpy = jest.spyOn(basePantry, "updatePantryWithPantry").mockImplementationOnce(() => {
        return "OK";
    });
    
    await consumeIngredientFromPantry(pantry2.ingredientID, 1);

    let copyPantry = {...pantry2};
    copyPantry.quantity = 1;

    expect(getAllPantryByIngredientIDSpy).toHaveBeenCalledWith(pantry2.ingredientID);
    expect(deletePantryByIDSpy).toHaveBeenCalledWith(copyPantry);
});

test('updatePantryWhenMealsIsDone', async () => {
    let getMealByIDSpy = jest.spyOn(baseMeal, "getMealByID").mockImplementationOnce(() => {
        return meal;
    });

    let updateLastCookedSpy = jest.spyOn(baseRecipe, "updateLastCooked").mockImplementationOnce(() => {
        return "OK";
    });

    let getIngredientListSpy = jest.spyOn(handleComposition, "readComposition").mockImplementationOnce(() => {
        return [ingredientWithQuantity];
    });

    jest.spyOn(basePantry, "getAllPantryByIngredientID").mockImplementationOnce(() => {
        return [pantry];
    });

    jest.spyOn(basePantry, "deletePantryByID").mockImplementationOnce(() => {
        return "OK";
    });
    
    await updatePantryWhenMealIsDone.updatePantryWhenMealsIsDone(meal._id);

    expect(getMealByIDSpy).toHaveBeenCalledWith(meal._id);
    expect(updateLastCookedSpy).toHaveBeenCalledWith(meal.recipeID);
    expect(getIngredientListSpy).toHaveBeenCalledWith(meal.recipeID);
});
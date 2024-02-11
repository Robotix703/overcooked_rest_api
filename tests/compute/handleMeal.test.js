const baseMeal = require("../../build/compute/base/meal").baseMeal;
const baseRecipe = require("../../build/compute/base/recipe").baseRecipe;

const handleComposition = require("../../build/compute/handleComposition").handleComposition;
const handleMealFunction = require("../../build/compute/handleMeal");
const handleMeal = handleMealFunction.handleMeal;
const checkDisponibility = handleMealFunction.checkDisponibility;

const handleRecipe = require("../../build/compute/handleRecipe").handleRecipe;
const PantryInventory = require("../../build/compute/pantryInventory").PantryInventory;

let pantryInventory = {
    ingredientID: "string",
    quantityLeft: 10,
    expirationDate: null
}
let pantryInventoryDate = {
    ingredientID: "date",
    quantityLeft: 10,
    expirationDate: new Date(Date.now)
}
let pantryInventoryOldDate = {
    ingredientID: "date",
    quantityLeft: 10,
    expirationDate: new Date()
}
let pantryInventoryWrongQuantity = {
    ingredientID: "string",
    quantityLeft: 0,
    expirationDate: null
}

let meal = {
    _id: "date",
    recipeID: "string",
    numberOfLunchPlanned: 1
}
let meal2 = {
    _id: "string",
    recipeID: "recipeID2",
    numberOfLunchPlanned: 2
}

let ingredientWithQuantityNotConsumable = {
    ingredient: {
        _id: "date",
        name: "name",
        imagePath: "imagePath",
        consumable: false,
        category: "category",
        unitOfMeasure: "unitOfMeasure",
        shelfLife: 10
    },
    quantity: 1
}
let ingredientWithQuantityConsumable = {
    ingredient: {
        _id: "date",
        name: "name2",
        imagePath: "imagePath2",
        consumable: true,
        category: "category2",
        unitOfMeasure: "unitOfMeasure2",
        shelfLife: 1
    },
    quantity: 1
}

let recipe = {
    _id: "string",
    title: "title",
    numberOfLunch: 1,
    imagePath: "imagePath",
    category: "category",
    duration: 10,
    numberOfTimeCooked: null
}

test('initPantryInventory', async () => {
    let spy = jest.spyOn(PantryInventory, "getInventory").mockImplementationOnce(() => {
        return [pantryInventory];
    });
    
    await handleMeal.initPantryInventory();

    expect(spy).toHaveBeenCalled();
});

test('getMealNumber', async () => {
    jest.spyOn(baseMeal, "getAllMeals").mockImplementationOnce(() => {
        return [meal, meal2];
    });
    
    let result = await handleMeal.getMealNumber();

    expect(result).toBe(2);
});

test('checkDisponibility with correct date', async () => {
    jest.spyOn(PantryInventory, "getInventory").mockImplementationOnce(() => {
        return [pantryInventoryDate];
    });
    
    await handleMeal.initPantryInventory();
    
    let result = checkDisponibility(pantryInventoryDate.ingredientID, 1);

    expect(result).toBe(0);
});

test('checkDisponibility with expired date', async () => {
    jest.spyOn(PantryInventory, "getInventory").mockImplementationOnce(() => {
        return [pantryInventoryOldDate];
    });
    
    await handleMeal.initPantryInventory();
    
    let result = checkDisponibility(pantryInventoryOldDate.ingredientID, 1);

    expect(result).toBe(-1);
});

test('checkDisponibility without date', async () => {
    jest.spyOn(PantryInventory, "getInventory").mockImplementationOnce(() => {
        return [pantryInventory];
    });
    
    await handleMeal.initPantryInventory();
    
    let result = checkDisponibility(pantryInventory.ingredientID, 1);

    expect(result).toBe(0);
});

test('checkDisponibility without enough quantity', async () => {
    jest.spyOn(PantryInventory, "getInventory").mockImplementationOnce(() => {
        return [pantryInventoryWrongQuantity];
    });
    
    await handleMeal.initPantryInventory();
    
    let result = checkDisponibility(pantryInventoryWrongQuantity.ingredientID, 1);

    expect(result).toBe(-2);
});

test('checkDisponibility without ingredient', async () => {
    jest.spyOn(PantryInventory, "getInventory").mockImplementationOnce(() => {
        return [pantryInventory];
    });
    
    await handleMeal.initPantryInventory();
    
    let result = checkDisponibility("", 1);

    expect(result).toBe(-2);
});

test('checkIfMealIsReady with Ingredient not consumable', async () => {
    let baseMealSpy = jest.spyOn(baseMeal, "getMealByID").mockImplementationOnce(() => {
        return meal;
    });

    let handleRecipeSpy = jest.spyOn(handleComposition, "readComposition").mockImplementationOnce(() => {
        return [ingredientWithQuantityNotConsumable];
    });
    
    let result = await handleMeal.checkIfMealIsReady(meal._id);

    expect(baseMealSpy).toHaveBeenCalledWith(meal._id);
    expect(handleRecipeSpy).toHaveBeenCalledWith(meal.recipeID);
    expect(JSON.parse(JSON.stringify(result))).toMatchObject({
        ingredientAvailable: [],
        ingredientAlmostExpire: [],
        ingredientUnavailable: []
    })
});

test('checkIfMealIsReady with Ingredient consumable available', async () => {
    let baseMealSpy = jest.spyOn(baseMeal, "getMealByID").mockImplementationOnce(() => {
        return meal;
    });

    let handleRecipeSpy = jest.spyOn(handleComposition, "readComposition").mockImplementationOnce(() => {
        return [ingredientWithQuantityConsumable];
    });

    jest.spyOn(PantryInventory, "getInventory").mockImplementationOnce(() => {
        return [pantryInventoryDate];
    });
    await handleMeal.initPantryInventory();
    
    let result = await handleMeal.checkIfMealIsReady(meal._id);

    expect(baseMealSpy).toHaveBeenCalledWith(meal._id);
    expect(handleRecipeSpy).toHaveBeenCalledWith(meal.recipeID);
    expect(JSON.parse(JSON.stringify(result))).toMatchObject({
        ingredientAvailable: [ingredientWithQuantityConsumable],
        ingredientAlmostExpire: [],
        ingredientUnavailable: []
    })
});

test('checkIfMealIsReady with Ingredient consumable almost expired', async () => {
    let baseMealSpy = jest.spyOn(baseMeal, "getMealByID").mockImplementationOnce(() => {
        return meal;
    });

    let handleRecipeSpy = jest.spyOn(handleComposition, "readComposition").mockImplementationOnce(() => {
        return [ingredientWithQuantityConsumable];
    });

    jest.spyOn(PantryInventory, "getInventory").mockImplementationOnce(() => {
        return [pantryInventoryOldDate];
    });
    await handleMeal.initPantryInventory();
    
    let result = await handleMeal.checkIfMealIsReady(meal._id);

    expect(baseMealSpy).toHaveBeenCalledWith(meal._id);
    expect(handleRecipeSpy).toHaveBeenCalledWith(meal.recipeID);
    expect(JSON.parse(JSON.stringify(result))).toMatchObject({
        ingredientAvailable: [],
        ingredientAlmostExpire: [ingredientWithQuantityConsumable],
        ingredientUnavailable: []
    })
});

test('checkIfMealIsReady with Ingredient consumable unavailable', async () => {
    let baseMealSpy = jest.spyOn(baseMeal, "getMealByID").mockImplementationOnce(() => {
        return meal;
    });

    let handleRecipeSpy = jest.spyOn(handleComposition, "readComposition").mockImplementationOnce(() => {
        return [ingredientWithQuantityConsumable];
    });

    jest.spyOn(PantryInventory, "getInventory").mockImplementationOnce(() => {
        return [pantryInventoryWrongQuantity];
    });
    await handleMeal.initPantryInventory();
    
    let result = await handleMeal.checkIfMealIsReady(meal._id);

    expect(baseMealSpy).toHaveBeenCalledWith(meal._id);
    expect(handleRecipeSpy).toHaveBeenCalledWith(meal.recipeID);
    expect(JSON.parse(JSON.stringify(result))).toMatchObject({
        ingredientAvailable: [],
        ingredientAlmostExpire: [],
        ingredientUnavailable: [ingredientWithQuantityConsumable]
    })
});

test('checkMealList', async () => {
    jest.spyOn(baseMeal, "getAllMeals").mockImplementationOnce(() => {
        return [meal];
    });

    jest.spyOn(PantryInventory, "getInventory").mockImplementationOnce(() => {
        return [pantryInventoryWrongQuantity];
    });

    let getRecipeByIDSpy = jest.spyOn(baseRecipe, "getRecipeByID").mockImplementationOnce(() => {
        return recipe;
    });

    let checkIfMealIsReadySpy = jest.spyOn(handleMeal, "checkIfMealIsReady").mockImplementationOnce(() => {
        return {
            ingredientAvailable: [],
            ingredientAlmostExpire: [],
            ingredientUnavailable: [ingredientWithQuantityConsumable]
        };
    });
    
    let result = await handleMeal.checkMealList();
    let prettyResult = JSON.parse(JSON.stringify(result[0]));

    expect(getRecipeByIDSpy).toHaveBeenCalledWith(meal.recipeID);
    expect(checkIfMealIsReadySpy).toHaveBeenCalledWith(meal._id);
    expect(result.length).toBe(1);
    expect(prettyResult.title).toBe(recipe.title);
    expect(prettyResult.state).toMatchObject({
        ingredientAvailable: [],
        ingredientAlmostExpire: [],
        ingredientUnavailable: [ingredientWithQuantityConsumable]
    });
});

test('displayMealWithRecipeAndState', async () => {
    jest.spyOn(baseMeal, "getAllMeals").mockImplementationOnce(() => {
        return [meal];
    });

    jest.spyOn(PantryInventory, "getInventory").mockImplementationOnce(() => {
        return [pantryInventoryWrongQuantity];
    });

    let getRecipeByIDSpy = jest.spyOn(baseRecipe, "getRecipeByID").mockImplementationOnce(() => {
        return recipe;
    });

    let checkIfMealIsReadySpy = jest.spyOn(handleMeal, "checkIfMealIsReady").mockImplementationOnce(() => {
        return {
            ingredientAvailable: [],
            ingredientAlmostExpire: [],
            ingredientUnavailable: [ingredientWithQuantityConsumable]
        };
    });
    
    let result = await handleMeal.displayMealWithRecipeAndState();
    let prettyResult = JSON.parse(JSON.stringify(result[0]));

    expect(getRecipeByIDSpy).toHaveBeenCalledWith(meal.recipeID);
    expect(checkIfMealIsReadySpy).toHaveBeenCalledWith(meal._id);
    expect(result.length).toBe(1);
    expect(prettyResult._id).toBe(meal._id);
    expect(prettyResult.title).toBe(recipe.title);
    expect(prettyResult.imagePath).toBe(recipe.imagePath);
    expect(prettyResult.state).toMatchObject({
        ingredientAvailable: [],
        ingredientAlmostExpire: [],
        ingredientUnavailable: [ingredientWithQuantityConsumable]
    });
});
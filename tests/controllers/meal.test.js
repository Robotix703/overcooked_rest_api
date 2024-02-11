const baseMeal = require("../../build/compute/base/meal").baseMeal;
const baseRecipe = require("../../build/compute/base/recipe").baseRecipe;
const handleComposition = require("../../build/compute/handleComposition").handleComposition;
const handleMeal = require("../../build/compute/handleMeal").handleMeal;
const baseInstruction = require("../../build/compute/base/instruction").baseInstruction;

const registerIngredientsOnTodoFile = require("../../build/worker/registerIngredientsOnTodo").registerIngredientsOnTodo;
const updatePantryWhenMealIsDone = require("../../build/compute/updatePantryWhenMealIsDone").updatePantryWhenMealIsDone;

const mealController = require("../../build/controllers/meal").mealController;

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

let deleteOne = {
    n: 1,
    deletedCount: 1,
    ok: 1
}
let notdeleteOne = {
    n: 1,
    deletedCount: 0,
    ok: 1
}

let meal = {
    _id: "date",
    recipeID: "recipeID",
    numberOfLunchPlanned: 1
}

let mealStatus = {
    ingredientAvailable: [],
    ingredientAlmostExpire: [],
    ingredientUnavailable: []
}

let displayableMeal = {
    _id: "string",
    title: "title",
    numberOfLunch: 10,
    imagePath: "imagePath",
    state: mealStatus
}

let recipe = {
    _id: "string",
    title: "title",
    numberOfLunch: 2,
    imagePath: "imagePath",
    category: "category",
    duration: 10,
    numberOfTimeCooked: null
}

let updateOne = {
    n: 1,
    modifiedCount: 1,
    ok: 1
}
let notupdateOne = {
    n: 1,
    modifiedCount: 0,
    ok: 1
}

test('writeMeal', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            recipeID: "recipeID",
            numberOfLunchPlanned: 2
        }
    }

    jest.spyOn(baseInstruction, "getRecipeId").mockResolvedValue(recipe);

    let spy = jest.spyOn(baseMeal, "register").mockResolvedValue(
        "OK"
    );
    let spy2 = jest.spyOn(handleComposition, "readComposition").mockResolvedValue(
        [ingredientWithQuantityConsumable]
    );
    let spy3 = jest.spyOn(registerIngredientsOnTodoFile, "registerIngredients").mockResolvedValue(
        "OK"
    );
    let spy4 = jest.spyOn(baseRecipe, "getRecipeByID").mockResolvedValue(
        recipe
    );
    
    await mealController.writeMeal(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toBe("OK");
    expect(reponseStatus).toBe(201);
    expect(spy4).toHaveBeenCalledWith(mockRequest.body.recipeID);
    expect(spy3).toHaveBeenCalledWith([ingredientWithQuantityConsumable], recipe.title);

    spy.mockRestore();
    spy2.mockRestore();
    spy3.mockRestore();
    spy4.mockRestore();
});

test('consumeMeal with mealID and delete', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            mealID: "10"
        }
    }

    let spy = jest.spyOn(updatePantryWhenMealIsDone, "updatePantryWhenMealsIsDone").mockResolvedValue(
        
    );
    let spy2 = jest.spyOn(baseMeal, "deleteMeal").mockResolvedValue(
        deleteOne
    );
    
    await mealController.consumeMeal(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ status: "ok" });
    expect(reponseStatus).toBe(200);
    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
    spy2.mockRestore();
});
test('consumeMeal with mealID but no delete', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            mealID: "10"
        }
    }

    let spy = jest.spyOn(updatePantryWhenMealIsDone, "updatePantryWhenMealsIsDone").mockResolvedValue(
        
    );
    let spy2 = jest.spyOn(baseMeal, "deleteMeal").mockResolvedValue(
        notdeleteOne
    );
    
    await mealController.consumeMeal(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ errorMessage: "Wrong ID"});
    expect(reponseStatus).toBe(404);

    spy.mockRestore();
    spy2.mockRestore();
});
test('consumeMeal without mealID', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            
        }
    }

    let spy = jest.spyOn(updatePantryWhenMealIsDone, "updatePantryWhenMealsIsDone").mockResolvedValue(
        "OK"
    );
    let spy2 = jest.spyOn(baseMeal, "deleteMeal").mockResolvedValue(
        notdeleteOne
    );
    
    await mealController.consumeMeal(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ errorMessage: "No mealID provided"});
    expect(reponseStatus).toBe(400);
    expect(spy2).not.toHaveBeenCalled();

    spy.mockRestore();
    spy2.mockRestore();
});

test('readMeals', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            pageSize: "10",
            currentPage: "1"
        }
    }

    let spy = jest.spyOn(baseMeal, "getAllMeals").mockResolvedValue(
        [meal]
    );
    let spy2 = jest.spyOn(baseMeal, "count").mockResolvedValue(
        2
    );
    
    await mealController.readMeals(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        meals: [meal],
        count: 2
    });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});

test('checkIfReady', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            pageSize: "10",
            currentPage: "1"
        }
    }

    let spy = jest.spyOn(handleMeal, "initPantryInventory").mockResolvedValue(
        "OK"
    );
    let spy2 = jest.spyOn(handleMeal, "checkIfMealIsReady").mockResolvedValue(
        mealStatus
    );
    
    await mealController.checkIfReady(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(mealStatus);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});

test('displayable', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {

    }

    let spy = jest.spyOn(handleMeal, "displayMealWithRecipeAndState").mockResolvedValue(
        [displayableMeal]
    );
    
    await mealController.displayable(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject([displayableMeal]);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});

test('updateMeal', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            recipeID: "recipeID",
            numberOfLunchPlanned: 10
        }
    }

    let spy = jest.spyOn(baseMeal, "update").mockResolvedValue(
        updateOne
    );
    
    await mealController.updateMeal(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(updateOne);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});
test('updateMeal with not modification', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            recipeID: "recipeID",
            numberOfLunchPlanned: 10
        }
    }

    let spy = jest.spyOn(baseMeal, "update").mockResolvedValue(
        notupdateOne
    );
    
    await mealController.updateMeal(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ errorMessage: "Pas de modification" });
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
});
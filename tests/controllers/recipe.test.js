const baseRecipe = require("../../build/compute/base/recipe").baseRecipe;
const baseMeal = require("../../build/compute/base/meal").baseMeal;
const handleRecipe = require("../../build/compute/handleRecipe").handleRecipe;

const recipeController = require("../../build/controllers/recipe").recipeController;


let recipe = {
    _id: "string",
    title: "title",
    numberOfLunch: 2,
    imagePath: "imagePath",
    category: "category",
    duration: 10,
    numberOfTimeCooked: null
}

let prettyIngredient = {
    name: "name",
    imagePath: "imagePath",
    quantity: 4,
    unitOfMeasure: "unitOfMeasure"
}

let prettyInstruction = {
    _id: "string",
    text: "text",
    recipeID: "recipeID",
    composition: [prettyIngredient],
    order: 10
}

let prettyRecipe = {
    _id: "string",
    title: "title",
    numberOfLunch: 10,
    category: "category",
    duration: 2,
    instructions: [prettyInstruction]
}

let meal = {
    _id: "string",
    recipeID: "recipeID",
    numberOfLunchPlanned: 4
}

let ingredientWithQuantity = {
    ingredient: {
        _id: "string",
        name: "name",
        imagePath: "imagePath",
        consumable: true,
        category: "category",
        unitOfMeasure: "unitOfMeasure"
    },
    quantity: 2
}

let update = {
    n: 1,
    modifiedCount: 1,
    ok: 1
}
let notUpdate = {
    n: 1,
    modifiedCount: 0,
    ok: 1
}

let deleteOne = {
    n: 1,
    deletedCount: 1,
    ok: 1
}
let notDeleteOne = {
    n: 1,
    deletedCount: 0,
    ok: 1
}

test('readRecipes', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            pageSize: "10",
            currentPage: 2
        }
    }

    let spy = jest.spyOn(baseRecipe, "filterRecipe").mockResolvedValue(
        [recipe]
    );
    let spy2 = jest.spyOn(baseRecipe, "count").mockResolvedValue(
        2
    );
    
    await recipeController.readRecipes(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        recipes: [recipe],
        count: 2
    });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});

test('getRecipeByID', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            recipeID: recipe._id
        }
    }

    let spy = jest.spyOn(baseRecipe, "getRecipeByID").mockResolvedValue(
        recipe
    );
    
    await recipeController.getRecipeByID(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(recipe);
    expect(reponseStatus).toBe(200);
    expect(spy).toHaveBeenCalledWith(recipe._id);

    spy.mockRestore();
});

test('getRecipeByName', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            name: recipe.name
        }
    }

    let spy = jest.spyOn(baseRecipe, "searchByName").mockResolvedValue(
        [recipe]
    );
    let spy2 = jest.spyOn(baseRecipe, "count").mockResolvedValue(
        2
    );
    
    await recipeController.getRecipeByName(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        recipes: [recipe],
        count: 2
    });
    expect(reponseStatus).toBe(200);
    expect(spy).toHaveBeenCalledWith(recipe.name);

    spy.mockRestore();
    spy2.mockRestore();
});

test('getPrettyRecipe with recipeID', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            recipeID: recipe._id
        }
    }

    let spy = jest.spyOn(handleRecipe, "getPrettyRecipe").mockResolvedValue(
        prettyRecipe
    );
    
    await recipeController.getPrettyRecipe(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(prettyRecipe);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});
test('getPrettyRecipe with mealID', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            mealID: recipe._id
        }
    }

    let spy = jest.spyOn(handleRecipe, "getPrettyRecipe").mockResolvedValue(
        prettyRecipe
    );
    let spy2 = jest.spyOn(baseMeal, "getMealByID").mockResolvedValue(
        meal
    );
    
    await recipeController.getPrettyRecipe(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(prettyRecipe);
    expect(reponseStatus).toBe(200);
    expect(spy2).toHaveBeenCalledWith(recipe._id);

    spy.mockRestore();
    spy2.mockRestore();
});
test('getPrettyRecipe without anything', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            
        }
    }
    
    await recipeController.getPrettyRecipe(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        errorMessage: "RecipeID not found"
    });
    expect(reponseStatus).toBe(400);
});

test('getIngredientsNeeded with recipeID', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            recipeID: recipe._id
        }
    }

    let spy = jest.spyOn(baseRecipe, "getRecipeByID").mockResolvedValue(
        recipe
    );
    let spy2 = jest.spyOn(handleRecipe, "getIngredientList").mockResolvedValue(
        [ingredientWithQuantity]
    );
    
    await recipeController.getIngredientsNeeded(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject([ingredientWithQuantity]);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});
test('getIngredientsNeeded with mealID', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            mealID: recipe._id
        }
    }

    let spy = jest.spyOn(baseRecipe, "getRecipeByID").mockResolvedValue(
        recipe
    );
    let spy2 = jest.spyOn(handleRecipe, "getIngredientList").mockResolvedValue(
        [ingredientWithQuantity]
    );
    let spy3 = jest.spyOn(baseMeal, "getMealByID").mockResolvedValue(
        meal
    );
    
    await recipeController.getIngredientsNeeded(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject([ingredientWithQuantity]);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
    spy3.mockRestore();
});
test('getIngredientsNeeded without anything', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
           
        }
    }
    
    await recipeController.getIngredientsNeeded(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        errorMessage: "RecipeID not found"
    });
    expect(reponseStatus).toBe(400);
});

test('deleteRecipe', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        }
    }

    let spy = jest.spyOn(baseRecipe, "deleteOne").mockResolvedValue(
        deleteOne
    );
    
    await recipeController.deleteRecipe(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(deleteOne);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});
test('deleteRecipe with error', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        }
    }

    let spy = jest.spyOn(baseRecipe, "deleteOne").mockResolvedValue(
        notDeleteOne
    );
    
    await recipeController.deleteRecipe(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(notDeleteOne);
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
});
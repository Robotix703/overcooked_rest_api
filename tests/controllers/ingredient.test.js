const baseIngredient = require("../../build/compute/base/ingredient").baseIngredient;
const ingredientController = require("../../build/controllers/ingredient").ingredientController;

let ingredient = {
    _id: '507f191e810c19729de860ea',
    name: "name",
    imagePath: "imagePath",
    consumable: true,
    unitOfMeasure: "unitOfMeasure",
    shelfLife: 10,
    freezable: true
}

test('readIngredients', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            name: "name",
            limit: "10"
        }
    }

    let getFilteredIngredientSpy = jest.spyOn(baseIngredient, "getFilteredIngredient").mockResolvedValue([ingredient]);
    let countSpy = jest.spyOn(baseIngredient, "count").mockResolvedValue(1);
    
    await ingredientController.readIngredients(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        ingredients: [ingredient],
        ingredientCount: 1
    });
    expect(reponseStatus).toBe(200);
    expect(getFilteredIngredientSpy).toHaveBeenCalledWith(mockRequest.query.name, null, 10);
    expect(countSpy).toHaveBeenCalled();

    getFilteredIngredientSpy.mockRestore();
});

test('consumableID', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        
    }

    let registerSpy = jest.spyOn(baseIngredient, "getConsumableIngredients").mockResolvedValue([ingredient]);
    
    await ingredientController.consumableID(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        IngredientsID: [ingredient._id],
        count: 1
    });
    expect(reponseStatus).toBe(200);

    registerSpy.mockRestore();
});

test('searchByName', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            name: "name"
        }
    }

    let findByNameSpy = jest.spyOn(baseIngredient, "findByName").mockResolvedValue([ingredient]);
    
    await ingredientController.searchByName(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        ingredients: [ingredient],
        ingredientCount: 1
    });
    expect(reponseStatus).toBe(200);

    findByNameSpy.mockRestore();
});

test('getIngredientByID', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            ingredientID: "ingredientID"
        }
    }

    let findByNameSpy = jest.spyOn(baseIngredient, "getIngredientByID").mockResolvedValue(ingredient);
    
    await ingredientController.getIngredientByID(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(ingredient);
    expect(reponseStatus).toBe(200);

    findByNameSpy.mockRestore();
});

test('getAllIngredientsName', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
    }

    let findByNameSpy = jest.spyOn(baseIngredient, "getAllIngredientsName").mockResolvedValue([ingredient.name]);
    
    await ingredientController.getAllIngredientsName(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject([ingredient.name]);
    expect(reponseStatus).toBe(200);

    findByNameSpy.mockRestore();
});

test('filteredIngredients', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            name: "name",
            category: "category"
        }
    }

    let findByNameSpy = jest.spyOn(baseIngredient, "getFilteredIngredient").mockResolvedValue([ingredient]);
    
    await ingredientController.filteredIngredients(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject([ingredient]);
    expect(reponseStatus).toBe(200);

    findByNameSpy.mockRestore();
});

test('getAllIngredientForAutocomplete', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {

    }

    let findByNameSpy = jest.spyOn(baseIngredient, "getAllIngredients").mockResolvedValue([ingredient]);
    
    await ingredientController.getAllIngredientForAutocomplete(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject([ingredient.name + " - " + ingredient.unitOfMeasure]);
    expect(reponseStatus).toBe(200);

    findByNameSpy.mockRestore();
});

test('editIngredient OK', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            name: "name",
            consumable: true,
            unitOfMeasure: "unitOfMeasure",
            shelfLife: 1,
            freezable: false
        }
    }

    let update = {
        n: 1,
        modifiedCount: 1,
        ok: 1
    }

    let findByNameSpy = jest.spyOn(baseIngredient, "updateIngredient").mockResolvedValue(update);
    
    await ingredientController.editIngredient(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        status: "OK"
    });
    expect(reponseStatus).toBe(200);

    findByNameSpy.mockRestore();
});

test('editIngredient NOK', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            name: "name",
            consumable: true,
            unitOfMeasure: "unitOfMeasure",
            shelfLife: 1,
            freezable: false
        }
    }

    let update = {
        n: 1,
        modifiedCount: 0,
        ok: 1
    }

    let findByNameSpy = jest.spyOn(baseIngredient, "updateIngredient").mockResolvedValue(update);
    
    await ingredientController.editIngredient(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        message: "Pas de modification"
    });
    expect(reponseStatus).toBe(500);

    findByNameSpy.mockRestore();
});

test('deleteIngredient OK', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        }
    }

    let deleteOne = {
        n: 1,
        deletedCount: 1,
        ok: 1
    }

    let findByNameSpy = jest.spyOn(baseIngredient, "deleteOne").mockResolvedValue(deleteOne);
    
    await ingredientController.deleteIngredient(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(deleteOne);
    expect(reponseStatus).toBe(200);

    findByNameSpy.mockRestore();
});

test('deleteIngredient NOK', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        }
    }

    let deleteOne = {
        n: 1,
        deletedCount: 0,
        ok: 1
    }

    let findByNameSpy = jest.spyOn(baseIngredient, "deleteOne").mockResolvedValue(deleteOne);
    
    await ingredientController.deleteIngredient(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(deleteOne);
    expect(reponseStatus).toBe(401);

    findByNameSpy.mockRestore();
});
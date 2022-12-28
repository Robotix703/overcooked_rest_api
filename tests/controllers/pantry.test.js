const basePantry = require("../../build/compute/base/pantry").basePantry;
const baseIngredient = require("../../build/compute/base/ingredient").baseIngredient;

const handlePantry = require("../../build/compute/handlePantry").handlePantry;

const checkTodoListFile = require("../../build/worker/checkTodoList");
const PantryInventory = require("../../build/compute/pantryInventory").PantryInventory;

const pantryController = require("../../build/controllers/pantry").pantryController;

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

let pantry = {
    _id: "string",
    ingredientID: "ingredientID",
    quantity: 1,
    expirationDate: null,
    frozen: false
}

let date = new Date();
date.setDate(date.getDate() + 1);
let pantry2 = {
    _id: "string",
    ingredientID: "ingredientID",
    quantity: 1,
    expirationDate: date,
    frozen: false
}

let pantry3 = {
    _id: "string2",
    ingredientID: "ingredientID2",
    quantity: 2,
    expirationDate: new Date(),
    frozen: true
}

let pantryStatus = {
    quantityLeft: 3,
    nearestExpirationDate: "12/12/2012"
}
let prettyInventory = [{
    ingredientID: ingredient._id,
    quantityLeft: pantryStatus.quantityLeft
}]

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

test('writePantry', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            ingredientID: "ingredientID",
            quantity: 10,
            expirationDate: null,
            frozen: false
        }
    }

    let spy = jest.spyOn(basePantry, "register").mockResolvedValue(
        "OK"
    );
    
    await pantryController.writePantry(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toBe("OK");
    expect(reponseStatus).toBe(201);

    spy.mockRestore();
});

test('writePantryByIngredientName', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            ingredientName: "ingredientName",
            ingredientID: "ingredientID",
            quantity: 10,
            expirationDate: null,
            frozen: false
        }
    }

    let spy = jest.spyOn(basePantry, "register").mockResolvedValue(
        "OK"
    );
    let spy2 = jest.spyOn(baseIngredient, "getIngredientByName").mockResolvedValue(
        ingredient
    );
    
    await pantryController.writePantryByIngredientName(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toBe("OK");
    expect(reponseStatus).toBe(201);

    spy.mockRestore();
    spy2.mockRestore();
});

test('freezePantry with update', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            ingredientName: "ingredientName",
            ingredientID: "ingredientID",
            quantity: 10,
            expirationDate: null,
            frozen: false
        }
    }

    let spy = jest.spyOn(handlePantry, "freezePantry").mockResolvedValue(
        updateOne
    );
    
    await pantryController.freezePantry(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(updateOne);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});
test('freezePantry without update', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            ingredientName: "ingredientName",
            ingredientID: "ingredientID",
            quantity: 10,
            expirationDate: null,
            frozen: false
        }
    }

    let spy = jest.spyOn(handlePantry, "freezePantry").mockResolvedValue(
        notupdateOne
    );
    
    await pantryController.freezePantry(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ errorMessage: "Pantry not found"});
    expect(reponseStatus).toBe(404);

    spy.mockRestore();
});

test('refreshTodoist', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
    }

    let spy = jest.spyOn(checkTodoListFile, "default").mockResolvedValue(
        "OK"
    );
    
    await pantryController.refreshTodoist(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ result: "OK" });
    expect(reponseStatus).toBe(201);

    spy.mockRestore();
});

test('readPantries', async () => {
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

    let spy = jest.spyOn(basePantry, "getAllPantries").mockResolvedValue(
        [pantry]
    );
    let spy2 = jest.spyOn(basePantry, "count").mockResolvedValue(
        2
    );
    
    await pantryController.readPantries(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        pantries: [pantry],
        pantryCount: 2
      });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});

test('quantityLeft', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            ingredientID: "ingredientID"
        }
    }

    let spy = jest.spyOn(basePantry, "getByIngredientID").mockResolvedValue(
        [pantry]
    );
    
    await pantryController.quantityLeft(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ quantityLeft: 1 });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});

test('getNearestExpirationDate without date', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            ingredientID: "ingredientID"
        }
    }

    let spy = jest.spyOn(basePantry, "getByIngredientID").mockResolvedValue(
        [pantry]
    );
    
    await pantryController.getNearestExpirationDate(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ nearestExpirationDate: pantry.expirationDate });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});
test('getNearestExpirationDate without date', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            ingredientID: "ingredientID"
        }
    }

    let spy = jest.spyOn(basePantry, "getByIngredientID").mockResolvedValue(
        [pantry2]
    );
    
    await pantryController.getNearestExpirationDate(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ nearestExpirationDate: pantry2.expirationDate });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});
test('getNearestExpirationDate without date in the past', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            ingredientID: "ingredientID"
        }
    }

    let spy = jest.spyOn(basePantry, "getByIngredientID").mockResolvedValue(
        [pantry3]
    );
    
    await pantryController.getNearestExpirationDate(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ nearestExpirationDate: pantry3.expirationDate });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});

test('getFullPantryInventory', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
    }

    let spy = jest.spyOn(PantryInventory, "getFullInventory").mockResolvedValue(
        prettyInventory
    );
    
    await pantryController.getFullPantryInventory(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(prettyInventory);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});

test('getPantryByID with pantry and ingredientName', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            pantryID: "pantryID"
        }
    }

    let spy = jest.spyOn(basePantry, "getPantryByID").mockResolvedValue(
        pantry
    );
    let spy2 = jest.spyOn(baseIngredient, "getIngredientNameByID").mockResolvedValue(
        ingredient.name
    );
    
    await pantryController.getPantryByID(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        _id: pantry._id,
        ingredientID: pantry.ingredientID,
        quantity: pantry.quantity,
        expirationDate: pantry.expirationDate,
        ingredientName: ingredient.name,
        frozen: pantry.frozen
    });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});
test('getPantryByID with pantry but without ingredientName', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            pantryID: "pantryID"
        }
    }

    let spy = jest.spyOn(basePantry, "getPantryByID").mockResolvedValue(
        pantry
    );
    let spy2 = jest.spyOn(baseIngredient, "getIngredientNameByID").mockResolvedValue(
        
    );
    
    await pantryController.getPantryByID(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        errorMessage: "ingredient not found"
    });
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
    spy2.mockRestore();
});
test('getPantryByID without pantry and ingredientName', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            pantryID: "pantryID"
        }
    }

    let spy = jest.spyOn(basePantry, "getPantryByID").mockResolvedValue(
        
    );
    let spy2 = jest.spyOn(baseIngredient, "getIngredientNameByID").mockResolvedValue(
        
    );
    
    await pantryController.getPantryByID(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        errorMessage: "Pantry not found"
    });
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
    spy2.mockRestore();
});

test('updatePantry without ingredientName', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            
        }
    }
    
    await pantryController.updatePantry(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        errorMessage: "IngredientName not provided"
      });
    expect(reponseStatus).toBe(400);
});
test('updatePantry without ingredient', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            ingredientName: "ingredientName"
        }
    }

    let spy = jest.spyOn(baseIngredient, "getIngredientByName").mockResolvedValue(
        
    );
    
    await pantryController.updatePantry(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        errorMessage: "IngredientName not found"
    });
    expect(reponseStatus).toBe(400);

    spy.mockRestore();
});
test('updatePantry with update', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            ingredientName: "ingredientName"
        }
    }

    let spy = jest.spyOn(baseIngredient, "getIngredientByName").mockResolvedValue(
        ingredient
    );
    let spy2 = jest.spyOn(basePantry, "updatePantry").mockResolvedValue(
        updateOne
    );
    
    await pantryController.updatePantry(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({status: "OK"});
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});
test('updatePantry without update', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            ingredientName: "ingredientName"
        }
    }

    let spy = jest.spyOn(baseIngredient, "getIngredientByName").mockResolvedValue(
        ingredient
    );
    let spy2 = jest.spyOn(basePantry, "updatePantry").mockResolvedValue(
        notupdateOne
    );
    
    await pantryController.updatePantry(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ message: "Pas de modification" });
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
    spy2.mockRestore();
});

test('deletePantry with delete', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            ingredientName: "ingredientName"
        }
    }

    let spy = jest.spyOn(basePantry, "deleteOne").mockResolvedValue(
        deleteOne
    );
    
    await pantryController.deletePantry(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(deleteOne);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});
test('deletePantry without delete', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            ingredientName: "ingredientName"
        }
    }

    let spy = jest.spyOn(basePantry, "deleteOne").mockResolvedValue(
        notdeleteOne
    );
    
    await pantryController.deletePantry(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(notdeleteOne);
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
});
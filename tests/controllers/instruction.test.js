const handleRecipe = require("../../build/compute/handleRecipe").handleRecipe;
const handleInstruction = require("../../build/compute/handleInstructions").handleInstruction;
const baseInstruction = require("../../build/compute/base/instruction").baseInstruction;
const baseIngredient = require("../../build/compute/base/ingredient").baseIngredient;

const instructionController = require("../../build/controllers/instruction").instructionController;

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

let instruction = {
    _id: "string",
    text: "text",
    recipeID: "recipeID",
    ingredientsID: ["toto", "tata"],
    quantity: [2, 3],
    order: 5,
    cookingTime: 6
}

let prettyInstruction = {
    _id: "string",
    text: "text",
    recipeID: "recipeID",
    composition: "IPrettyIngredient[]",
    order: 10,
    cookingTime: 12
}

test('writeIngredient', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            text: "text",
            recipeID: "recipeID",
            ingredients: [ingredient],
            quantity: 2,
            order: 1,
            cookingTime: 3
        }
    }

    let spy = jest.spyOn(baseInstruction, "register").mockResolvedValue(
        "OK"
    );
    
    await instructionController.writeInstruction(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toBe("OK");
    expect(reponseStatus).toBe(201);

    spy.mockRestore();
});

test('writeInstructionByIngredientName with ingredient', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            text: "text",
            recipeID: "recipeID",
            ingredients: [ingredient],
            quantity: 2,
            order: 1,
            cookingTime: 3
        }
    }

    let spy = jest.spyOn(baseIngredient, "getIngredientsIDByName").mockResolvedValue(
        [ingredient.name]
    );
    let spy2 = jest.spyOn(baseInstruction, "register").mockResolvedValue(
        "OK"
    );
    
    await instructionController.writeInstructionByIngredientName(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toBe("OK");
    expect(reponseStatus).toBe(201);

    spy.mockRestore();
    spy2.mockRestore();
});
test('writeInstructionByIngredientName without ingredient', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            text: "text",
            recipeID: "recipeID",
            ingredients: [ingredient],
            quantity: 2,
            order: 1,
            cookingTime: 3
        }
    }

    let spy = jest.spyOn(baseIngredient, "getIngredientsIDByName").mockResolvedValue(
        []
    );
    let spy2 = jest.spyOn(baseInstruction, "register").mockResolvedValue(
        "OK"
    );
    
    await instructionController.writeInstructionByIngredientName(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        errorMessage: "No valid ingredient"
    });
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
    spy2.mockRestore();
});

test('readInstructions', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            pageSize: "11",
            currentPage: "12"
        }
    }

    let spy = jest.spyOn(baseInstruction, "getAllInstructions").mockResolvedValue(
        [instruction]
    );
    let spy2 = jest.spyOn(baseInstruction, "count").mockResolvedValue(
        2
    );
    
    await instructionController.readInstructions(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        instructions: [instruction],
        instructionCount: 2
    });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});

test('getByRecipeID', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            recipeID: "11"
        }
    }

    let spy = jest.spyOn(handleRecipe, "getInstructionsByRecipeID").mockResolvedValue(
        [prettyInstruction]
    );
    
    await instructionController.getByRecipeID(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject([prettyInstruction]);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});

test('getInstructionCountForRecipe', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            recipeID: "11"
        }
    }

    let spy = jest.spyOn(handleInstruction, "getInstructionCountForRecipe").mockResolvedValue(
        2
    );
    
    await instructionController.getInstructionCountForRecipe(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toBe(2);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});

test('getInstructionByID', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        query: {
            instructionID: "11"
        }
    }

    let spy = jest.spyOn(handleInstruction, "getPrettyInstructionByID").mockResolvedValue(
        instruction
    );
    
    await instructionController.getInstructionByID(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(instruction);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});

test('updateInstruction with update', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "string"
        },
        body: {
            text: "text",
            order: 1,
            cookingTime: 11,
            ingredients: [ingredient]
        }
    }

    let update = {
        n: 1,
        modifiedCount: 1,
        ok: 1
    }

    let spy = jest.spyOn(baseIngredient, "getIngredientsIDByName").mockResolvedValue(
        [ingredient._id]
    );
    let spy2 = jest.spyOn(baseInstruction, "updateInstruction").mockResolvedValue(
        update
    );
    
    await instructionController.updateInstruction(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        status: "OK"
    });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});
test('updateInstruction without update', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "string"
        },
        body: {
            text: "text",
            order: 1,
            cookingTime: 11,
            ingredients: [ingredient]
        }
    }

    let update = {
        n: 1,
        modifiedCount: 0,
        ok: 1
    }

    let spy = jest.spyOn(baseIngredient, "getIngredientsIDByName").mockResolvedValue(
        [ingredient._id]
    );
    let spy2 = jest.spyOn(baseInstruction, "updateInstruction").mockResolvedValue(
        update
    );
    
    await instructionController.updateInstruction(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        message: "Pas de modification"
    });
    expect(reponseStatus).toBe(401);

    spy.mockRestore();
    spy2.mockRestore();
});

test('deleteInstruction with delete', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "string"
        }
    }

    let deleteOne = {
        n: 1,
        deletedCount: 1,
        ok: 1
    }

    let spy = jest.spyOn(baseInstruction, "deleteOne").mockResolvedValue(
        deleteOne
    );
    
    await instructionController.deleteInstruction(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(deleteOne);
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});
test('deleteInstruction without delete', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "string"
        }
    }

    let deleteOne = {
        n: 1,
        deletedCount: 0,
        ok: 1
    }

    let spy = jest.spyOn(baseInstruction, "deleteOne").mockResolvedValue(
        deleteOne
    );
    
    await instructionController.deleteInstruction(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject(deleteOne);
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
});
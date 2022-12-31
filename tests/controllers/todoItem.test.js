const baseTodoItem = require("../../build/compute/base/todoItem").baseTodoItem;
const handleTodoItem = require("../../build/compute/handleTodoItem").handleTodoItem;

const Todoist = require("../../build/modules/todoist").Todoist;
const registerIngredient = require("../../build/worker/registerIngredientsOnTodo").registerIngredientsOnTodo;
const todoItemController = require("../../build/controllers/todoItem").todoItemController;

let todoItem = {
    _id: "15",
    todoID: 10,
    text: "pommes - 10 pc",
    ingredientName: "ingredientName",
    consumable: true,
    underline: "underline",
    priority: 3
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

test('readTodoItems', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {

    }

    let spy = jest.spyOn(baseTodoItem, "readTodoItems").mockResolvedValue(
        [todoItem]
    );
    let spy2 = jest.spyOn(baseTodoItem, "count").mockResolvedValue(
        2
    );
    
    await todoItemController.readTodoItems(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        todoItems: [todoItem],
        count: 2
    });
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
    spy2.mockRestore();
});

test('writeTodoItem', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        body: {
            ingredientID: "ingredientID",
            name: "name",
            quantity: "quantity",
            unitOfMeasure: "unitOfMeasure"
        }
    }

    let spy = jest.spyOn(registerIngredient, "registerIngredient").mockResolvedValue(
        "OK"
    );
    
    await todoItemController.writeTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({message: "Registered !"});
    expect(reponseStatus).toBe(201);
    expect(spy).toHaveBeenCalledWith(
        mockRequest.body.ingredientID,
        mockRequest.body.name,
        mockRequest.body.quantity,
        "Extra"
    )

    spy.mockRestore();
});

test('updateTodoItem', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: todoItem._id
        },
        body: {
            todoID: todoItem.todoID,
            text: todoItem.text,
            ingredientName: todoItem.ingredientName,
            consumable: todoItem.consumable,
            underline: todoItem.underline,
            priority: todoItem.priority
        }
    }

    let spy = jest.spyOn(baseTodoItem, "updateTodoItem").mockResolvedValue(
        update
    );
    let spy2 = jest.spyOn(Todoist, "updateItem").mockResolvedValue(
        true
    );
    
    await todoItemController.updateTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({status: "Ok"});
    expect(reponseStatus).toBe(200);
    expect(spy).toHaveBeenCalledWith(
        todoItem._id,
        todoItem.todoID,
        todoItem.text,
        todoItem.ingredientName,
        todoItem.consumable,
        todoItem.underline,
        todoItem.priority
    )

    spy.mockRestore();
    spy2.mockRestore();
});
test('updateTodoItem without updateResult', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            todoID: "todoID",
            text: "text",
            ingredientName: "ingredientName",
            consumable: "consumable"
        }
    }

    let spy = jest.spyOn(baseTodoItem, "updateTodoItem").mockResolvedValue(
        
    );
    let spy2 = jest.spyOn(Todoist, "updateItem").mockResolvedValue(
        true
    );
    
    await todoItemController.updateTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({
        errorMessage: "Update failed"
    });
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
    spy2.mockRestore();
});
test('updateTodoItem without update', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            todoID: "todoID",
            text: "text",
            ingredientName: "ingredientName",
            consumable: "consumable"
        }
    }

    let spy = jest.spyOn(baseTodoItem, "updateTodoItem").mockResolvedValue(
        notUpdate
    );
    let spy2 = jest.spyOn(Todoist, "updateItem").mockResolvedValue(
        true
    );
    
    await todoItemController.updateTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ message: "Pas de modification" });
    expect(reponseStatus).toBe(401);

    spy.mockRestore();
    spy2.mockRestore();
});
test('updateTodoItem with error on todoist', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: "id"
        },
        body: {
            todoID: "todoID",
            text: "text",
            ingredientName: "ingredientName",
            consumable: "consumable"
        }
    }

    let spy = jest.spyOn(baseTodoItem, "updateTodoItem").mockResolvedValue(
        update
    );
    let spy2 = jest.spyOn(Todoist, "updateItem").mockResolvedValue(
        false
    );
    
    await todoItemController.updateTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ message: "Problem with todoist" });
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
    spy2.mockRestore();
});

test('deleteTodoItem', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: todoItem._id
        }
    }

    let spy = jest.spyOn(baseTodoItem, "getTodoItemByID").mockResolvedValue(
        todoItem
    );
    let spy2 = jest.spyOn(baseTodoItem, "deleteTodoItemByID").mockResolvedValue(
        deleteOne
    );
    let spy3 = jest.spyOn(Todoist, "deleteItem").mockResolvedValue(
        true
    );
    
    await todoItemController.deleteTodoItem(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toMatchObject({ status: "Ok" });
    expect(reponseStatus).toBe(200);
    expect(spy).toHaveBeenCalledWith(todoItem._id);
    expect(spy2).toHaveBeenCalledWith(todoItem._id);
    expect(spy3).toHaveBeenCalledWith(todoItem.todoID);

    spy.mockRestore();
    spy2.mockRestore();
    spy3.mockRestore();
});

test('updateQuantity', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: todoItem._id
        },
        body: {
            quantity: "15"
        }
    }

    let spy = jest.spyOn(handleTodoItem, "updateQuantity").mockResolvedValue(
        update
    );
    
    await todoItemController.updateQuantity(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toBe("OK");
    expect(reponseStatus).toBe(200);

    spy.mockRestore();
});
test('updateQuantity without update', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: todoItem._id
        },
        body: {
            quantity: "15"
        }
    }

    let spy = jest.spyOn(handleTodoItem, "updateQuantity").mockResolvedValue(
        notUpdate
    );
    
    await todoItemController.updateQuantity(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toBe("TodoItem - Update didn't work");
    expect(reponseStatus).toBe(500);

    spy.mockRestore();
});
test('updateQuantity without quantity', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {
            id: todoItem._id
        },
        body: {

        }
    }
    
    await todoItemController.updateQuantity(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toBe("TodoItem - Quantity not provided");
    expect(reponseStatus).toBe(400);
});
test('updateQuantity without id', async () => {
    let mockStatusCode = jest.fn();
    let mockResponse = {
        status : mockStatusCode.mockReturnValue({json: jest.fn()})
    }

    let mockRequest = {
        params: {

        },
        body: {

        }
    }
    
    await todoItemController.updateQuantity(mockRequest, mockResponse);

    let responseBody = mockResponse.status().json.mock.calls[0][0];
    let reponseStatus = mockStatusCode.mock.calls[0][0];

    expect(responseBody).toBe("TodoItem - ID not provided");
    expect(reponseStatus).toBe(400);
});
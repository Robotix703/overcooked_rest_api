const handleRecipeFile = require("../../build/compute/handleRecipe");
const handleRecipe = handleRecipeFile.handleRecipe;
const getIngredientIDFromInstruction = handleRecipeFile.getIngredientIDFromInstruction;
const concatList = handleRecipeFile.concatList;
const adaptQuantity = handleRecipeFile.adaptQuantity;
const sortInstructions = handleRecipeFile.sortInstructions;

const baseInstruction = require("../../build/compute/base/instruction").baseInstruction;
const baseRecipe = require("../../build/compute/base/recipe").baseRecipe;
const baseIngredient = require("../../build/compute/base/ingredient").baseIngredient;

let instruction = {
    _id: "62b8ad1f81cbd30a41126474",
    text: "texte",
    recipeID: "recipeID",
    ingredientsID: ["62b8872d377c98a5a09cc6ee", "62b8872d377c98a5a09cc6ef"],
    quantity: [3, 4],
    order: 1,
    cookingTime: 10
}
let instruction2 = {
    _id: "string2",
    text: "texte2",
    recipeID: "recipeID2",
    ingredientsID: ["4", "5"],
    quantity: [3, 4],
    order: 2,
    cookingTime: 17
}

let ingredientWithQuantity = {
    ingredient: {
        _id: "string",
        name: "name",
        imagePath: "imagePath",
        consumable: true,
        category: "category",
        unitOfMeasure: "unitOfMeasure",
        shelfLife: 10
    },
    quantity: 2
}
let ingredientWithQuantity2 = {
    ingredient: {
        _id: "string2",
        name: "name2",
        imagePath: "imagePath2",
        consumable: true,
        category: "category2",
        unitOfMeasure: "unitOfMeasure2",
        shelfLife: 14
    },
    quantity: 2
}
let ingredientWithQuantity3 = {
    ingredient: {
        _id: "string",
        name: "name2",
        imagePath: "imagePath2",
        consumable: true,
        category: "category2",
        unitOfMeasure: "unitOfMeasure2",
        shelfLife: 14
    },
    quantity: 2
}
let ingredientWithQuantity4 = {
    ingredient: {
        _id: "string",
        name: "name",
        imagePath: "imagePath",
        consumable: true,
        category: "category",
        unitOfMeasure: "unitOfMeasure",
        shelfLife: 10
    },
    quantity: 2
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

let ingredient1 = {
    _id: instruction.ingredientsID[0],
    name: "name",
    imagePath: "imagePath",
    consumable: true,
    category: "category",
    unitOfMeasure: "unitOfMeasure",
    shelfLife: 10
}

let ingredient2 = {
    _id: instruction.ingredientsID[1],
    name: "name",
    imagePath: "imagePath",
    consumable: true,
    category: "category",
    unitOfMeasure: "unitOfMeasure",
    shelfLife: 10
}

test('getIngredientIDFromInstruction', async () => {
    let getInstructionByIDSpy = jest.spyOn(baseInstruction, "getInstructionByID").mockImplementationOnce(() => {
        return instruction;
    });
    
    let result = await getIngredientIDFromInstruction(instruction.recipeID);

    expect(getInstructionByIDSpy).toHaveBeenCalledWith(instruction.recipeID);
    expect(JSON.parse(JSON.stringify(result))).toMatchObject([
        {
            ingredientID: instruction.ingredientsID[0],
            quantity: 3
        }
        ,
        {
            ingredientID: instruction.ingredientsID[1],
            quantity: 4
        }
    ]);
});

test('concatList', async () => {
    let originalList = [ingredientWithQuantity];
    let additionalList = [ingredientWithQuantity2, ingredientWithQuantity3];
    
    concatList(originalList, additionalList);

    expect(originalList.length).toBe(2);
    expect(originalList[0].quantity).toBe(4);
});

test('adaptQuantity', async () => {
    let originalList = [ingredientWithQuantity4];
    
    adaptQuantity(originalList, 4, 2);

    expect(originalList[0].quantity).toBe(4);
});

test('sortInstructions', async () => {

    expect(sortInstructions(instruction, instruction2)).toBe(-1);
    expect(sortInstructions(instruction2, instruction)).toBe(1);
    expect(sortInstructions(instruction, instruction)).toBe(0);
});

test('getIngredientList', async () => {

    expect(sortInstructions(instruction, instruction2)).toBe(-1);
    expect(sortInstructions(instruction2, instruction)).toBe(1);
    expect(sortInstructions(instruction, instruction)).toBe(0);
});

test('getIngredientList', async () => {
    let getInstructionByRecipeIDSpy = jest.spyOn(baseInstruction, "getInstructionByRecipeID").mockImplementationOnce(() => {
        return [instruction];
    });

    let getRecipeByIDSpy = jest.spyOn(baseRecipe, "getRecipeByID").mockImplementationOnce(() => {
        return recipe;
    });

    let getIngredientByIDSpy = jest.spyOn(baseIngredient, "getIngredientByID").mockImplementation((instructionID) => {
        return instructionID == instruction.ingredientsID[0] ? ingredient1 : ingredient2;
    });
    
    let result = await handleRecipe.getIngredientList(instruction.recipeID, 4);

    expect(getInstructionByRecipeIDSpy).toHaveBeenCalledWith(instruction.recipeID);
    expect(getRecipeByIDSpy).toHaveBeenCalledWith(instruction.recipeID);
    expect(getIngredientByIDSpy).toHaveBeenCalledTimes(2);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([
        {
            ingredient: ingredient1,
            quantity: 6
        },
        {
            ingredient: ingredient2,
            quantity: 8
        }
    ]);
});

test('getInstructionsByRecipeID', async () => {
    let getInstructionByRecipeIDSpy = jest.spyOn(baseInstruction, "getInstructionByRecipeID").mockImplementationOnce(() => {
        return [instruction];
    });

    let getInstructionByIDSpy = jest.spyOn(baseInstruction, "getInstructionByID").mockImplementationOnce(() => {
        return instruction;
    });

    let getIngredientsByIDSpy = jest.spyOn(baseIngredient, "getIngredientsByID").mockImplementationOnce(() => {
        return [ingredient1];
    });
    
    let result = await handleRecipe.getInstructionsByRecipeID(ingredientWithQuantity.ingredient._id);

    expect(getInstructionByRecipeIDSpy).toHaveBeenCalledWith(ingredientWithQuantity.ingredient._id);
    expect(getInstructionByIDSpy).toHaveBeenCalledWith(instruction._id);
    expect(getIngredientsByIDSpy).toHaveBeenCalledWith([instruction.ingredientsID[0], instruction.ingredientsID[1]]);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([
        {
            _id: instruction._id,
            text: instruction.text,
            recipeID: instruction.recipeID,
            composition: [{
                name: ingredient1.name,
                imagePath: ingredient1.imagePath,
                quantity: instruction.quantity[0],
                unitOfMeasure: ingredient1.unitOfMeasure
            }],
            order: instruction.order,
            cookingTime: instruction.cookingTime
        }
    ]);
});

test('getPrettyRecipe', async () => {
    jest.spyOn(baseInstruction, "getInstructionByRecipeID").mockImplementationOnce(() => {
        return [instruction];
    });

    jest.spyOn(baseInstruction, "getInstructionByID").mockImplementationOnce(() => {
        return instruction;
    });

    jest.spyOn(baseIngredient, "getIngredientsByID").mockImplementationOnce(() => {
        return [ingredient1];
    });

    let getRecipeByIDSpy = jest.spyOn(baseRecipe, "getRecipeByID").mockImplementationOnce(() => {
        return recipe;
    });
    
    let result = await handleRecipe.getPrettyRecipe(recipe._id);

    expect(getRecipeByIDSpy).toHaveBeenCalledWith(recipe._id);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject({
        _id: recipe._id,
        title: recipe.title,
        numberOfLunch: recipe.numberOfLunch,
        category: recipe.category,
        duration: recipe.duration,
        instructions: [
            {
                _id: instruction._id,
                text: instruction.text,
                recipeID: instruction.recipeID,
                composition: [{
                    name: ingredient1.name,
                    imagePath: ingredient1.imagePath,
                    quantity: instruction.quantity[0],
                    unitOfMeasure: ingredient1.unitOfMeasure
                }],
                order: instruction.order,
                cookingTime: instruction.cookingTime
            }
        ]
    });
});
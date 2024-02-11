const baseInstruction = require("../../build/compute/base/instruction").baseInstruction;
const baseIngredient = require("../../build/compute/base/ingredient").baseIngredient;
const handleInstruction = require("../../build/compute/handleInstructions").handleInstruction;

let instruction = {
    _id: "string",
    text: "text",
    recipeID: "recipeID",
    ingredientsID: ["toto", "tata"],
    quantity: [2, 3],
    order: 5,
    cookingTime: 6
}
let instruction2 = {
    _id: "string2",
    text: "text2",
    recipeID: "recipeID2",
    ingredientsID: ["toto2", "tata2"],
    quantity: [4, 6],
    order: 10,
    cookingTime: 12
}

let ingredient = {
    _id: "string",
    name: "name",
    imagePath: "imagePath",
    consumable: true,
    category: "category",
    unitOfMeasure: "unitOfMeasure"
}
let ingredient2 = {
    _id: "string2",
    name: "name2",
    imagePath: "imagePath2",
    consumable: false,
    category: "category2",
    unitOfMeasure: "unitOfMeasure2"
}

test('getInstructionCountForRecipe', async () => {
    let spy = jest.spyOn(baseInstruction, "getInstructionByRecipeID").mockImplementationOnce(() => {
        return [instruction, instruction2];
    });
    
    let result = await handleInstruction.getInstructionCountForRecipe(instruction.recipeID);

    expect(result).toBe(2);
    expect(spy).toHaveBeenCalledWith(instruction.recipeID);
});

test('getPrettyInstructionByID', async () => {
    let spyInstruction = jest.spyOn(baseInstruction, "getInstructionByID").mockImplementationOnce(() => {
        return instruction;
    });
    let spyIngredient = jest.spyOn(baseIngredient, "getIngredientsByID").mockImplementationOnce(() => {
        return [ingredient, ingredient2];
    });
    
    let result = await handleInstruction.getPrettyInstructionByID(instruction._id);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(
        {
            _id: instruction._id,
            text: instruction.text,
            composition: [
                {
                    name: ingredient.name,
                    imagePath: ingredient.imagePath,
                    quantity: instruction.quantity[0],
                    unitOfMeasure: ingredient.unitOfMeasure
                },
                {
                    name: ingredient2.name,
                    imagePath: ingredient2.imagePath,
                    quantity: instruction.quantity[1],
                    unitOfMeasure: ingredient2.unitOfMeasure
                }
            ],
            order: instruction.order,
            cookingTime: instruction.cookingTime
        }
    );
    expect(spyInstruction).toHaveBeenCalledWith(instruction._id);
    expect(spyIngredient).toHaveBeenCalledWith(instruction.ingredientsID);
});
const mockingoose = require('mockingoose');

const Instruction = require("../../../build/models/instruction").default;
const baseInstruction = require("../../../build/compute/base/instruction").baseInstruction;

const instruction = {
    _id: "62adae9b0169e2c199433bda",
    text: "text",
    recipeID: "recipeID",
    ingredientsID: ["ingredientsID"],
    quantity: [10],
    order: 12,
    cookingTime: 3
}

test('getInstructionByID', async () => {

    mockingoose(Instruction).toReturn(instruction, 'findOne');

    let result = await baseInstruction.getInstructionByID(instruction._id);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(instruction);
});

test('getInstructionByRecipeID', async () => {

    mockingoose(Instruction).toReturn(instruction, 'find');

    let result = await baseInstruction.getInstructionByRecipeID(instruction.recipeID);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(instruction);
});

test('updateInstruction', async () => {

    mockingoose(Instruction).toReturn("OK", 'updateOne');

    let result = await baseInstruction.updateInstruction(
        instruction._id,
        instruction.text,
        instruction.recipeID,
        instruction.ingredientsID,
        instruction.quantity,
        instruction.order,
        instruction.cookingTime);

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('register', async () => {

    mockingoose(Instruction).toReturn(instruction, 'save');

    let result = await baseInstruction.register(
        instruction.text,
        instruction.recipeID,
        instruction.ingredientsID,
        instruction.quantity,
        instruction.order,
        instruction.cookingTime);

    let prettyResult = JSON.parse(JSON.stringify(result));
    expect(prettyResult.id.length).toBeGreaterThanOrEqual(10);
    expect(prettyResult.instruction.text).toBe(instruction.text);
});

test('getAllInstructions without page size', async () => {

    mockingoose(Instruction).toReturn(instruction, 'find');

    let result = await baseInstruction.getAllInstructions();

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(instruction);
});

test('getAllInstructions with page size', async () => {

    mockingoose(Instruction).toReturn(instruction, 'find');

    let result = await baseInstruction.getAllInstructions(10, 1);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(instruction);
});

test('count', async () => {

    mockingoose(Instruction).toReturn(2, 'count');

    let result = await baseInstruction.count();

    expect(result).toBe(2);
});

test('deleteOne', async () => {

    mockingoose(Instruction).toReturn("OK", 'deleteOne');

    let result = await baseInstruction.deleteOne();

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});
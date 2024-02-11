const mockingoose = require('mockingoose');

const Pantry = require("../../../build/models/pantry").default;
const basePantry = require("../../../build/compute/base/pantry").basePantry;

let pantry = {
    _id: "62adecd7c2285147db155742",
    ingredientID: "ingredientID",
    quantity: 10
}

let pantry2 = {
    _id: "62adecd7c2285147db155743",
    ingredientID: "ingredientID2",
    quantity: 12
}

test('getAllPantryByIngredientID', async () => {
    mockingoose(Pantry).toReturn([pantry, pantry2], 'find');

    let result = await basePantry.getAllPantryByIngredientID(pantry.ingredientID);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([pantry, pantry2]);
});

test('deletePantryByID', async () => {
    mockingoose(Pantry).toReturn("OK", 'deleteOne');

    let result = await basePantry.deletePantryByID(pantry._id);

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('updatePantryWithPantry', async () => {
    mockingoose(Pantry).toReturn("OK", 'updateOne');

    let result = await basePantry.updatePantryWithPantry(pantry._id);

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('getAllPantries without pageSize', async () => {
    mockingoose(Pantry).toReturn([pantry, pantry2], 'find');

    let result = await basePantry.getAllPantries();

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([pantry, pantry2]);
});
test('getAllPantries with pageSize', async () => {
    mockingoose(Pantry).toReturn([pantry, pantry2], 'find');

    let result = await basePantry.getAllPantries(10, 1);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([pantry, pantry2]);
});

test('getPantryByID', async () => {
    mockingoose(Pantry).toReturn(pantry, 'findOne');

    let result = await basePantry.getPantryByID(pantry._id);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(pantry);
});

test('updatePantry', async () => {
    mockingoose(Pantry).toReturn("OK", 'updateOne');

    let result = await basePantry.updatePantry(
        pantry._id,
        pantry.ingredientID,
        pantry.quantity
    );

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('getByID', async () => {
    mockingoose(Pantry).toReturn(pantry, 'findOne');

    let result = await basePantry.getByID(pantry._id);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(pantry);
});

test('register', async () => {
    mockingoose(Pantry).toReturn(pantry, 'save');

    let result = await basePantry.register(
        pantry.ingredientID,
        pantry.quantity
    );

    let prettyResult = JSON.parse(JSON.stringify(result));
    expect(prettyResult.id.length).toBeGreaterThanOrEqual(10);
});

test('count', async () => {
    mockingoose(Pantry).toReturn(10, 'count');

    let result = await basePantry.count();

    expect(JSON.parse(JSON.stringify(result))).toBe(10);
});

test('deleteOne', async () => {
    mockingoose(Pantry).toReturn("OK", 'deleteOne');

    let result = await basePantry.deleteOne();

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});
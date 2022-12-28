const mockingoose = require('mockingoose');

const Ingredient = require("../../../build/models/ingredient").default;
const baseIngredient = require("../../../build/compute/base/ingredient").baseIngredient;

let ingredient = {
    _id: '507f191e810c19729de860ea',
    name: "name",
    imagePath: "imagePath",
    consumable: true,
    unitOfMeasure: "unitOfMeasure",
    shelfLife: 10,
    freezable: true
}

let ingredientWrong = {
    _id: '507f191e810c19729de8dfze',
    name: "name2",
    imagePath: "imagePath2",
    consumable: false,
    unitOfMeasure: "unitOfMeasure2",
    shelfLife: 12,
    freezable: false
}

test('getIngredientNameByID', async () => {

    mockingoose(Ingredient).toReturn(ingredient, 'findOne');

    let result = await baseIngredient.getIngredientNameByID(ingredient._id);

    expect(result).toBe("name");
});

test('getIngredientByID', async () => {

    mockingoose(Ingredient).toReturn(ingredient, 'findOne');

    let result = await baseIngredient.getIngredientByID(ingredient._id);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(ingredient);
});

test('getIngredientsByID', async () => {

    mockingoose(Ingredient).toReturn(ingredient, 'findOne');

    let result = await baseIngredient.getIngredientsByID([ingredient._id, ingredient._id]);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([ingredient, ingredient]);
});

test('getIngredientByName', async () => {

    mockingoose(Ingredient).toReturn([ingredient, ingredientWrong], 'find');

    let result = await baseIngredient.getIngredientByName(ingredient.name);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(ingredient);
});

test('getAllIngredientsName', async () => {

    mockingoose(Ingredient).toReturn([ingredient, ingredientWrong], 'find');

    let result = await baseIngredient.getAllIngredientsName();

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([ingredient.name, ingredientWrong.name]);
});

test('getIngredientsIDByName', async () => {

    mockingoose(Ingredient).toReturn([ingredient], 'find');

    let result = await baseIngredient.getIngredientsIDByName([ingredient.name, ingredientWrong.name]);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([ingredient._id, ingredient._id]);
});

test('getIngredientsNameFromIDs', async () => {

    mockingoose(Ingredient).toReturn(ingredient, 'findOne');

    let result = await baseIngredient.getIngredientsNameFromIDs([ingredient._id, ingredientWrong._id]);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([ingredient.name, ingredient.name]);
});

test('getFilteredIngredient with pageSize', async () => {

    mockingoose(Ingredient).toReturn([ingredient], 'find');

    let result = await baseIngredient.getFilteredIngredient(ingredient.name, ingredient.category, 1, 1);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([ingredient]);
});

test('getFilteredIngredient without pageSize', async () => {

    mockingoose(Ingredient).toReturn([ingredient], 'find');

    let result = await baseIngredient.getFilteredIngredient(ingredient.name, ingredient.category);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([ingredient]);
});

test('updateIngredient', async () => {

    mockingoose(Ingredient).toReturn("OK", 'updateOne');

    let result = await baseIngredient.updateIngredient(
        ingredient._id,
        ingredient.name,
        ingredient.consumable,
        ingredient.unitOfMeasure,
        ingredient.shelfLife,
        ingredient.freezable);

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('getAllIngredients', async () => {

    mockingoose(Ingredient).toReturn([ingredient], 'find');

    let result = await baseIngredient.getAllIngredients();

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([ingredient]);
});

test('getConsumableIngredients', async () => {

    mockingoose(Ingredient).toReturn([ingredient], 'find');

    let result = await baseIngredient.getConsumableIngredients();

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([ingredient]);
});

test('count', async () => {

    mockingoose(Ingredient).toReturn(10, 'count');

    let result = await baseIngredient.count();

    expect(JSON.parse(JSON.stringify(result))).toBe(10);
});

test('register', async () => {

    mockingoose(Ingredient).toReturn(ingredient, 'save');

    let result = await baseIngredient.register(
        ingredient.name,
        ingredient.imagePath,
        ingredient.consumable,
        ingredient.unitOfMeasure,
        ingredient.shelfLife,
        ingredient.freezable);
    
    let prettyResult = JSON.parse(JSON.stringify(result));
    expect(prettyResult.id.length).toBeGreaterThanOrEqual(10);
    expect(prettyResult.ingredient.name).toBe(ingredient.name);
});

test('deleteOne', async () => {

    mockingoose(Ingredient).toReturn("OK", 'deleteOne');

    let result = await baseIngredient.deleteOne(ingredient._id);

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('findByName', async () => {

    mockingoose(Ingredient).toReturn([ingredient], 'find');

    let result = await baseIngredient.findByName(ingredient.name);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([ingredient]);
});
const mockingoose = require('mockingoose');

const Recipe = require("../../../build/models/recipe").default;
const baseRecipe = require("../../../build/compute/base/recipe").baseRecipe;

let recipe = {
    _id: "62adf57ab21e2a086562a80a",
    title: "title",
    numberOfLunch: 14,
    imagePath: "imagePath",
    category: "category",
    duration: 56,
    numberOfTimeCooked: null,
}

let recipe2 = {
    _id: "62adf57ab21e2a086562a80b",
    title: "title2",
    numberOfLunch: 15,
    imagePath: "imagePath2",
    category: "category2",
    duration: 577,
    numberOfTimeCooked: null,
}

test('getRecipeByID', async () => {
    mockingoose(Recipe).toReturn(recipe, 'findOne');

    let result = await baseRecipe.getRecipeByID(recipe._id);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(recipe);
});

test('updateNumberOfTimeCooked', async () => {
    mockingoose(Recipe).toReturn(recipe, 'findOne');
    mockingoose(Recipe).toReturn("OK", 'updateOne');

    let result = await baseRecipe.updateNumberOfTimeCooked(recipe._id);

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('filterRecipe', async () => {
    mockingoose(Recipe).toReturn(recipe, 'find');

    let result = await baseRecipe.filterRecipe();

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(recipe);
});

test('updateRecipe', async () => {
    mockingoose(Recipe).toReturn("OK", 'updateOne');

    let result = await baseRecipe.updateRecipe(
        recipe._id,
        recipe.title,
        recipe.numberOfLunch,
        recipe.imagePath,
        recipe.category,
        recipe.duration,
        recipe.numberOfTimeCooked
    );

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('searchByName', async () => {
    mockingoose(Recipe).toReturn(recipe, 'find');

    let result = await baseRecipe.searchByName(recipe.title);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(recipe);
});

test('register', async () => {
    mockingoose(Recipe).toReturn(recipe, 'save');

    let result = await baseRecipe.register(
        recipe.title,
        recipe.numberOfLunch,
        recipe.imagePath,
        recipe.category,
        recipe.duration,
        recipe.numberOfTimeCooked
    );

    let prettyResult = JSON.parse(JSON.stringify(result));
    expect(prettyResult.id.length).toBeGreaterThanOrEqual(10);
    expect(prettyResult.recipe.title).toBe(recipe.title);
});

test('count', async () => {
    mockingoose(Recipe).toReturn(10, 'count');

    let result = await baseRecipe.count();

    expect(JSON.parse(JSON.stringify(result))).toBe(10);
});

test('deleteOne', async () => {
    mockingoose(Recipe).toReturn("OK", 'deleteOne');

    let result = await baseRecipe.deleteOne();

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});
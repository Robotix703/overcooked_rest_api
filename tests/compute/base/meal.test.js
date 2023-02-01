const mockingoose = require('mockingoose');

const Meal = require("../../../build/models/meal").default;
const baseMeal = require("../../../build/compute/base/meal").baseMeal;

let meal = {
    _id: "62ade7624d9e831eddc8320b",
    recipeID: "recipeID"
}

test('getMealByID', async () => {
    mockingoose(Meal).toReturn(meal, 'findOne');

    let result = await baseMeal.getMealByID(meal._id);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(meal);
});

test('getAllMeals without pageSize', async () => {
    mockingoose(Meal).toReturn(meal, 'find');

    let result = await baseMeal.getAllMeals();

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(meal);
});
test('getAllMeals with pageSize', async () => {
    mockingoose(Meal).toReturn(meal, 'find');

    let result = await baseMeal.getAllMeals(10, 1);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(meal);
});

test('deleteMeal', async () => {
    mockingoose(Meal).toReturn("OK", 'deleteOne');

    let result = await baseMeal.deleteMeal();

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('register', async () => {
    mockingoose(Meal).toReturn(meal, 'save');

    let result = await baseMeal.register(
        meal.recipeID,
        meal.numberOfLunchPlanned
    );

    let prettyResult = JSON.parse(JSON.stringify(result));
    expect(prettyResult.id.length).toBeGreaterThanOrEqual(10);
    expect(prettyResult.meal.recipeID).toBe(meal.recipeID);
});

test('count', async () => {
    mockingoose(Meal).toReturn(10, 'count');

    let result = await baseMeal.count();

    expect(JSON.parse(JSON.stringify(result))).toBe(10);
});

test('update', async () => {
    mockingoose(Meal).toReturn("OK", 'updateOne');

    let result = await baseMeal.update(
        meal._id,
        meal.recipeID,
        meal.numberOfLunchPlanned
    );

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});

test('deleteOne', async () => {
    mockingoose(Meal).toReturn("OK", 'deleteOne');

    let result = await baseMeal.deleteOne();

    expect(JSON.parse(JSON.stringify(result))).toBe("OK");
});
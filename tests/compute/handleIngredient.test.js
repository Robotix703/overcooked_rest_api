const baseIngredient = require("../../build/compute/base/ingredient").baseIngredient;
const handleIngredient = require("../../build/compute/handleIngredient").handleIngredient;

let ingredient = {
    _id: '507f191e810c19729de860ea',
    name: "name",
    imagePath: "imagePath",
    consumable: true,
    category: "category",
    unitOfMeasure: "unitOfMeasure",
    shelfLife: 10
}

test('getConsumable', async () => {
    jest.spyOn(baseIngredient, "getIngredientByID").mockImplementationOnce(() => {return ingredient});
    
    let result = await handleIngredient.getConsumable(ingredient._id);

    expect(result).toBe(true);
});
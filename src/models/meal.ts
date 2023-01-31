export interface IMeal {
  _id: string
  recipeID: string
}

const mongoose = require('mongoose');

export const mealSchema = mongoose.Schema({
  recipeID: { type: String, required: true }
});

const Meal = mongoose.model('Meal', mealSchema);
export default Meal;
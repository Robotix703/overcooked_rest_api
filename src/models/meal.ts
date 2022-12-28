export interface IMeal {
  _id: string
  recipeID: string
  numberOfLunchPlanned: number
}

const mongoose = require('mongoose');

export const mealSchema = mongoose.Schema({
  recipeID: { type: String, required: true },
  numberOfLunchPlanned: { type: Number, required: true }
});

const Meal = mongoose.model('Meal', mealSchema);
export default Meal;
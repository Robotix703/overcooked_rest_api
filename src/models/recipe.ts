export interface IRecipe{
  _id: string
  title: string
  numberOfLunch: number
  imagePath: string
  category: string
  duration: number
  lastCooked: Date | null
  composition: string | null
  tags: string[]
}

const mongoose = require('mongoose');

export const recipeSchema = mongoose.Schema({
  title: { type: String, required: true },
  numberOfLunch: { type: Number, required: true },
  imagePath: { type: String, required: true},
  category: { type: String, required: true },
  duration: { type: Number, required: true },
  lastCooked: { type: Date },
  composition: { type: String, required: false},
  tags: { type: [String] }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
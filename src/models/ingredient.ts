export interface IIngredient {
  _id: string
  name: string
  imagePath: string
  consumable: boolean
  unitOfMeasure: string
  shelfLife: number | null
  freezable: boolean
}

const mongoose = require('mongoose');

export const ingredientSchema = mongoose.Schema({
  name: { type: String, required: true },
  imagePath: { type: String, required:true },
  consumable: { type: Boolean, required: true },
  unitOfMeasure: { type: String, required: true },
  shelfLife: { type: Number },
  freezable: { type: Boolean, required: true }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
export default Ingredient;
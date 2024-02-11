export interface IPantry {
  _id: string
  ingredientID: string
  quantity: number
}

export interface IDiplayablePantry {
  _id: string
  ingredientName: string
  ingredientImage: string
  quantity: number
  quantityUnitOfMeasure: string
}

const mongoose = require('mongoose');

export const pantrySchema = mongoose.Schema({
  ingredientID: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const Pantry = mongoose.model('Pantry', pantrySchema);
export default Pantry;
export interface IPantry {
  _id: string
  ingredientID: string
  quantity: number
  expirationDate: Date | null
  frozen: boolean | null
}

export interface IDiplayablePantry {
  _id: string
  ingredientName: string
  ingredientImage: string
  quantity: number
  quantityUnitOfMeasure: string
  expirationDate: string | null
  frozen: boolean | null
}

const mongoose = require('mongoose');

export const pantrySchema = mongoose.Schema({
  ingredientID: { type: String, required: true },
  quantity: { type: Number, required: true },
  expirationDate: { type: Date },
  frozen: { type: Boolean }
});

const Pantry = mongoose.model('Pantry', pantrySchema);
export default Pantry;
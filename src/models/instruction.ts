export interface IInstruction {
  _id: string
  text: string
  recipeID: string
  ingredientsID: string[] | null
  quantity: number[] | null
  order: number
}

const mongoose = require('mongoose');

export const instructionSchema = mongoose.Schema({
  text: { type: String, required: true },
  recipeID: { type: String, required: true },
  ingredientsID: { type: [String] },
  quantity: { type: [Number] },
  order: { type: Number, required: true }
});

const Instruction = mongoose.model('Instruction', instructionSchema);
export default Instruction;
export interface ITodoItem {
  _id: string
  todoID: string
  text: string
  ingredientName: string
  consumable: boolean
  underline: string
  priority: number
}
export interface ITodoistText {
  ingredientName: string,
  quantity: number,
  unitOfMeasure: string
}

export function stringifyItem(ingredientName: string, quantity: number, unitOfMeasure: string) : string{
  return ingredientName + " - " + quantity.toString() + " " + unitOfMeasure;
}

export function parseItem(todoText: string) : ITodoistText {
  let parsedString = todoText.split(' ');
  return {
    ingredientName: parsedString[0],
    quantity: parseInt(parsedString[2]),
    unitOfMeasure: parsedString[3]
  }
}

const mongoose = require('mongoose');

export const todoItemSchema = mongoose.Schema({
  todoID: { type: Number, required: true },
  text: { type: String, required: true },
  ingredientName: { type: String, required: true },
  consumable: { type: Boolean, required: true },
  underline: { type: String, required: false },
  priority: { type: Number, required: false }
});

const TodoItem = mongoose.model('TodoItem', todoItemSchema);
export default TodoItem;
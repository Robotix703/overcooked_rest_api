export interface ITag{
    _id: string
    name: string
    color: string
    path: string
}
  
const mongoose = require('mongoose');
  
export const tagSchema = mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
    path: { type: String, required: true }
});
  
const Tag = mongoose.model('Tag', tagSchema);
export default Tag;
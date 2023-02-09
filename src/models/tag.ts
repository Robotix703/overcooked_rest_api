export interface ITag{
    _id: string
    name: string
    image: string
}
  
const mongoose = require('mongoose');
  
export const tagSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }
});
  
const Tag = mongoose.model('Tag', tagSchema);
export default Tag;
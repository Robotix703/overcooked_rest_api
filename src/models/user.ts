export interface IUser {
    _id: string
    email: string
    password: string
    phoneNumber: string
}

const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

export const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    phoneNumber: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);
export default User;
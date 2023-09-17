const mongoose = require('mongoose');
require('dotenv').config()

let uri: string;
if (process.env.NODE_ENV === "production") {
    uri = "mongodb://localhost:27017/overcookedProd"
}else{
    uri = "mongodb://localhost:27017/overcookedDev"
}

export async function connectToDataBase(){
    mongoose.set("strictQuery", false);
    return mongoose.connect(
        uri, { useNewUrlParser: true, useUnifiedTopology: true }
    )
}
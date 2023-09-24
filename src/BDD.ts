const mongoose = require('mongoose');
require('dotenv').config()

let uri: string;
if (process.env.NODE_ENV === "production") {
    uri = "mongodb://" + process.env.DB_PROD_USER + ":" + process.env.DB_PROD_PASS + "@" + process.env.DB_HOST + ":27017/" + process.env.DB_PROD_NAME + "?authSource=admin";
}else{
    uri = "mongodb://localhost:27017/" + process.env.DB_DEV_NAME + "?authSource=admin";
}

export async function connectToDataBase(){
    mongoose.set("strictQuery", false);
    return mongoose.connect(
        uri, { useNewUrlParser: true, useUnifiedTopology: true }
    )
}
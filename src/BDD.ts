const mongoose = require('mongoose');
require('dotenv').config()

let user: string, pwd: string, host: string, BDDname: string;
if (process.env.NODE_ENV === "production") {
    BDDname = process.env.DB_PROD_NAME;
    host = process.env.DB_HOST;
    user = process.env.DB_PROD_USER;
    pwd = process.env.DB_PROD_PASS;
}else{
    BDDname = process.env.DB_DEV_NAME;
    host = process.env.DB_IP;
    user = process.env.DB_DEV_USER;
    pwd = process.env.DB_DEV_PASS;
}

export async function connectToDataBase(){
    mongoose.set("strictQuery", false);
    return mongoose.connect(
        "mongodb://" + user + ":" + pwd + "@" + host + "/" + BDDname, 
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
}
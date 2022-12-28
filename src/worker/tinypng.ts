import path from "path";
import fs from 'fs';

require('dotenv').config();

const tinify = require("tinify");

//Authentication
tinify.key = process.env.TINYPNGKEY;

//Resize an image
export function resizeImage(filename: string) : void {
    let filePath : string = path.join("images", filename);

    resize(filePath, 200, undefined);
}

//Resize all image of a folder
export function resizeAll() : void{
    let files = fs.readdirSync('images');

    let jpg = files.filter(file => file.includes(".jpg"));
    let png = files.filter(file => file.includes(".png"));

    //PNG
    for(let image of png){
        resizeImage(image);
    }

    //JPG
    for(let image of jpg){
        resizeImage(image);
    }
}

function resize(filename: string, width: number, height: number) : void {
    if(!filename) return;

    const source = tinify.fromFile(filename);

    var resizeParams: {[k: string]: any} = {};
    resizeParams.method = "scale";
    if(width) resizeParams.width = width;
    if(height) resizeParams.height = height;

    const resized = source.resize(resizeParams);

    resized.toFile(filename);
}
require('dotenv').config();

export function checkAPIKey(apiKey: string){
    return process.env.APIKEY == apiKey;
}
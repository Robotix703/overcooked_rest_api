import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

//Authentication
const apiKey = process.env.REMOVEBG;

export async function removeBackgroundFromPath(filePath: string) : Promise<string | Error> {
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(filePath), path.basename(filePath));

    return axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
            ...formData.getHeaders(),
            'X-Api-Key': apiKey
        }
    })
    .then((response) => {
        if(!response || response.status != 200) throw new Error('Error:' + response.statusText);
        fs.writeFileSync(filePath, response.data);
    
        return filePath;
    })
    .catch((error) => {
        throw new Error(error);
    });
}
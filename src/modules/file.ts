import fs from 'fs';
import https from 'https';
import { removeBackgroundFromPath } from './removebg';
import { resizeImageFromPath } from './tinypng';

export async function handleIngredientImage(url: string, path: string) : Promise<void>{
    //Download image
    donwloadFile(url, path, async (err: Error) => {
        if(err) throw new Error(err.message);

        //Resize image
        await resizeImageFromPath(path);

        //Remove background
        await removeBackgroundFromPath(path);
    });
}

export async function handleRecipeImage(url: string, path: string) : Promise<string | Error> {
    //Download image
    await donwloadFile(url, path, async (err: Error) => {
        if(err) throw new Error("Error on image donwload : " + err.message);

        //Resize image
        await resizeImageFromPath(path);
    });

    return path;
}

export async function donwloadFile(url: string, dest: string, cb: (err: any) => void) {
    const file = fs.createWriteStream(dest);
    https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function (err: Error) { // Handle errors
        fs.unlink(dest, cb); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
}
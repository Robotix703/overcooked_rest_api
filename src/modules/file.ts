import fs from 'fs';
import https from 'https';
import { removeBackgroundFromPath } from './removebg';
import { resizeImageFromPath } from './tinypng';

export async function handleIngredientImage(url: string, ingredientName: string) : Promise<void>{
    const dest = `images/${ingredientName}.png`;

    //Download image
    donwloadFile(url, dest, async (err: Error) => {
        if(err) throw new Error(err.message);

        //Resize image
        await resizeImageFromPath(dest);

        //Remove background
        await removeBackgroundFromPath(dest);
    });
}

export async function handleRecipeImage(url: string, recipeName: string) : Promise<string | Error> {
    const dest = `images/${recipeName}.png`;

    //Download image
    await donwloadFile(url, dest, async (err: Error) => {
        if(err) throw new Error(err.message);

        //Resize image
        await resizeImageFromPath(dest);
    });

    return dest;
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
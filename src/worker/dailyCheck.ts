import { handleMeal, IMealPrettyStatus } from "../compute/handleMeal";
import { handlePantry, IPantryStatus } from "../compute/handlePantry";

import { sendSMSToEverybody } from "./sendSMSToEverybody";

export async function checkPlannedMeals() : Promise<string | void> {
    await handleMeal.initPantryInventory();
    const mealsState : IMealPrettyStatus[] |void = await handleMeal.checkMealList();
    if(!mealsState) return;

    const mealTotal : number | void = await handleMeal.getMealNumber();
    if(!mealTotal) return;

    let notReadyMeals : IMealPrettyStatus[] = [];
    let almostExpiredMeals : IMealPrettyStatus[] = [];
    for(let mealState of mealsState){
        if(mealState.state.ingredientUnavailable) notReadyMeals.push(mealState);
        else if(mealState.state.ingredientAlmostExpire) almostExpiredMeals.push(mealState);
    }

    let message : string | void;
    if(notReadyMeals.length > 0){
        message = "";
        for(let mealNotReady of notReadyMeals){
            message += "Le repas " + mealNotReady.title + " n'est pas prêt\n";
        }

        for(let mealAlmostExpire of almostExpiredMeals){
            message += "Le repas " + mealAlmostExpire.title + " va bientôt périmer\n";
        }

        if(mealTotal == notReadyMeals.length){
            message += "ATTENTION aucun repas n'est prêt\n";
        }
    }
    return message;
}

export async function checkPantry() : Promise<string | void> {
    let almostExpired : IPantryStatus[] = await handlePantry.checkPantryExpiration();

    let message : string | void;
    if(almostExpired.length > 0)
    {
        message = "\nLes ingrédients suivants vont périmer :\n";

        for(let element of almostExpired){
            message += element.ingredientName + " (Qty: " + element.quantity + ")(Exp: " + element.expirationDate + ")\n";
        }
    }
    return message;
}

export default async function dailyCheck() : Promise<void> {
    let messageToSend : string = "Information du jour\n\n";
    messageToSend += await checkPlannedMeals();
    messageToSend += await checkPantry();
    messageToSend += "\nhttps://overcooked.robotix703.fr/meal";

    sendSMSToEverybody.sendSMS(messageToSend);
}
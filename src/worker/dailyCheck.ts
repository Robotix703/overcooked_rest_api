import { handlePantry } from "../compute/handlePantry";

export default async function dailyCheck() : Promise<void> {
    await handlePantry.checkPantryExpiration();
}
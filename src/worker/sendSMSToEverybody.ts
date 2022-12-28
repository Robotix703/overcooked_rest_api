import { baseUser } from "../compute/base/user";

import SendSMS from "../modules/sms";

const Frindicator : string = "0033";
let g_phoneNumbers : string[] = [];

export function processPhoneNumber(phoneNumbers : string[]) : void {
    phoneNumbers.forEach((phoneNumber) => {
        if(phoneNumber.length == 10)
        {
            g_phoneNumbers.push(
                Frindicator + phoneNumber.slice(1)
            );
        }
    });
}

export namespace sendSMSToEverybody {
    export async function fetchPhoneNumber() : Promise<void> {
        const phoneNumbers : string[] = await baseUser.getAllUserPhoneNumber();
        processPhoneNumber(phoneNumbers);
    }
    
    export function sendSMS(message : string) : void {
        if(process.env.NODE_ENV === "production"){
            SendSMS(g_phoneNumbers, message);
        }
        console.log("SMS : " + message);
    }
}
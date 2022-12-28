require('dotenv').config();

import checkTodoList from "./worker/checkTodoList";
import dailyCheck from "./worker/dailyCheck";
import { sendSMSToEverybody } from "./worker/sendSMSToEverybody";
import { handleScheduleTask } from "./worker/handleScheduleTask";

const todoSurvey = "todoSurvey";
const dailySurvey = "dailySurvey";

function initSMS(){
    sendSMSToEverybody.fetchPhoneNumber();
}

function createIntervalCronSettings(interval: string){
    return "*/" + interval + " * * * *";
}

function createDailyCronSettings(hour: string){
    return "0 " + hour + " * * *";
}

function initTodoSurvey(){
    let cronInterval = createIntervalCronSettings(process.env.TODOCHECKINTERVAL);

    handleScheduleTask.addperiodicTask(
        checkTodoList,
        cronInterval,
        todoSurvey
    )
}

function initDailyCheck(){
    let cronInterval = createDailyCronSettings(process.env.DAILYNOTIFICATIONHOUR);

    handleScheduleTask.addperiodicTask(
        dailyCheck,
        cronInterval,
        dailySurvey
    )
}

export function init(){
    initSMS();
    initTodoSurvey();
    initDailyCheck();
}
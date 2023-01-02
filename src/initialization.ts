require('dotenv').config();

import checkTodoList from "./worker/checkTodoList";
import dailyCheck from "./worker/dailyCheck";
import { handleScheduleTask } from "./worker/handleScheduleTask";

const todoSurvey = "todoSurvey";
const dailySurvey = "dailySurvey";

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
    initTodoSurvey();
    initDailyCheck();
}
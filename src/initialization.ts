require('dotenv').config();

import checkTodoList from "./worker/checkTodoList";
import { handleScheduleTask } from "./worker/handleScheduleTask";

const todoSurvey = "todoSurvey";

function createIntervalCronSettings(interval: string){
    return "*/" + interval + " * * * *";
}

function initTodoSurvey(){
    let cronInterval = createIntervalCronSettings(process.env.TODOCHECKINTERVAL);

    handleScheduleTask.addperiodicTask(
        checkTodoList,
        cronInterval,
        todoSurvey
    )
}

export function init(){
    initTodoSurvey();
}
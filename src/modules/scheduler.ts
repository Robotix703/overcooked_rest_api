const schedule = require("node-schedule");

export function createJob(callback : any, cronSettings : string){
    return schedule.scheduleJob(cronSettings, callback);
}

export function cancelJob(job : any){
    return job.cancel();
}

process.on('SIGINT', function () {
    schedule.gracefulShutdown()
        .then(() => process.exit(0))
})
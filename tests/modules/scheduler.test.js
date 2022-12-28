const scheduler = require("../../build/modules/scheduler");

let temp = 0;
let callback = function(){
    temp++;
}

let cronSetting = "*/1 * * * * *";

test.skip('Create and stop Job', async () => {
    let job = scheduler.createJob(callback, cronSetting);

    setTimeout(() => {
        expect(temp).toBe(1);

        scheduler.cancelJob(job);
    }, 1000)
});
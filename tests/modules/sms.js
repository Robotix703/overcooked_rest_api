require('dotenv').config();
const sms = require("../../build/modules/sms");

const receiver = "0033" + process.env.PHONENUMBER;

test.skip('Get project name', async () => {
    expect(sms.SendSMS([receiver], "Bonjour"));
});
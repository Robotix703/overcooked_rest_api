const mockingoose = require('mockingoose');

const User = require("../../../build/models/user").default;
const baseUser = require("../../../build/compute/base/user").baseUser;

let user = {
    _id: "62af1095b8f08fe4f50da0fb",
    email: "email.email@email.com",
    password: "password",
    phoneNumber: "phoneNumber"
}

let user2 = {
    _id: "62af1095b8f08fe4f50da0fc",
    email: "email",
    password: "password",
    phoneNumber: "phoneNumber2"
}

test('getByEmail', async () => {
    mockingoose(User).toReturn(user, 'findOne');

    let result = await baseUser.getByEmail(user.phoneNumber);

    expect(JSON.parse(JSON.stringify(result))).toMatchObject(user);
});

test('getAllUserPhoneNumber', async () => {
    mockingoose(User).toReturn([user, user2], 'find');

    let result = await baseUser.getAllUserPhoneNumber();

    expect(JSON.parse(JSON.stringify(result))).toMatchObject([user.phoneNumber, user2.phoneNumber]);
});
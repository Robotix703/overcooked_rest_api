import User, { IUser } from "../../models/user";

export namespace baseUser {
    export async function getAllUserPhoneNumber() : Promise<string[]>{
        return User.find().then((results : IUser[]) => {
            return results.map((e : IUser) => e.phoneNumber);
        });
    }

    export async function register(email: string, password: string, phoneNumber: string) : Promise<any> {
        const user = new User({
            email: email,
            password: password,
            phoneNumber: phoneNumber
        });

        return user.save()
        .then((result: any) => {
            return { id: result._id, user: user };
        })
        .catch((error: Error) => {
            return { error: error };
        });
    }

    export async function getByEmail(email : string) : Promise<IUser> {
        return User.findOne({ email: email });
    }
}
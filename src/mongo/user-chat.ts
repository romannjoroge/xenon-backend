import { USERCHATS } from "./db";
import "dotenv/config";

export async function createUserAccount(email: string, displayName: string): Promise<string> {
    try {
        let doc = await USERCHATS.insertOne({
            email,
            displayName,
            chats: []
        });
        return doc.insertedId.toString();
    } catch(err) {
        console.log("Error Creating User Account", err);
        throw "Error Creating User Account";
    }
}

if(process.env.DEBUG_MODE) {
    async function test() {
        try {
            let id = await createUserAccount("test@test.com", "Tester");
            console.log(id);
        } catch(err) {
            console.log("Test Error =>", err);
        }
    }
    test()
}
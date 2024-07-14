import { USERCHATS } from "./db";
import "dotenv/config";
import {randomUUID} from "crypto"
import _ from "lodash";
import { ObjectId } from "mongodb";
const {isNil} = _;

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

export async function createChat(userID: string): Promise<string> {
    try {
        let userChat = await USERCHATS.findOne({_id: new ObjectId(userID)});
        if(!isNil(userChat)) {
            let chatID = randomUUID();
            userChat.chats.push({chatid: chatID, messages:[]})
            await USERCHATS.updateOne({_id: userChat._id}, {$set: {chats: userChat.chats}})
            return chatID;
        } 
        throw "User Does Not Exist";
    } catch(err) {
        console.log("Error Creating Chat", err)
        if(typeof(err) === 'string') {
            throw err;
        } else {
            throw "Error Creating Chat";
        }
    }   
}
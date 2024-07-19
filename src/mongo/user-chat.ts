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

export async function storeChats(userID: string, chatID: string, messages: {role: "user" | "system", content: string}[]) {
    try {
        let userChat = await USERCHATS.findOne({_id: new ObjectId(userID)});

        if(!isNil(userChat)) {
            let chatMessages = userChat.chats.find((chat) => chat.chatid == chatID);
            if(!isNil(chatMessages)) {
                console.log("\n\n", messages, "\n\n");
                chatMessages.messages = messages;
                for (let i = 0; i < userChat.chats.length; i++) {
                    if(userChat.chats[i].chatid == chatMessages.chatid) {
                        userChat.chats[i] = chatMessages
                    }
                }

                USERCHATS.updateOne({_id: new ObjectId(userID)}, {$set: {chats: userChat.chats}})
            } else {
                throw "Chat Does Not Exist";
            }
        } else {
            throw "User Does Not Exist";
        }
    } catch(err) {
        console.log("Error Chating =>", err);
        throw "Error Chating";
    }
}

export async function getChats(userID: string, chatID: string): Promise<{role: "user" | "system", content: string}[]> {
    try {
        let userChat = await USERCHATS.findOne({_id: new ObjectId(userID)});
        if(!isNil(userChat)) {
            let chatMessages = userChat.chats.find((chat) => chat.chatid == chatID);
            if(!isNil(chatMessages)) {
                return chatMessages.messages;
            } else {
                throw "Chat Does Not Exist";
            }
        } else {
            throw "User Does Not Exist";
        }
        
    } catch(err) {
        console.log("Error Getting Chats", err);
        throw "Error Getting Chats";
    }
}
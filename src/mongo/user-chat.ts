import { USERCHATS } from "./db.js";
import "dotenv/config";
import { randomUUID } from "crypto";
import _ from "lodash";
import { ObjectId } from "mongodb";
const { isNil } = _;

export async function createUserAccount(
  userid: string,
  email: string,
  displayName: string,
): Promise<string> {
  try {
    let doc = await USERCHATS.insertOne({
      id: userid,// console.log(emailObj, username);
      email,
      displayName,
      chats: [],
    });
    return doc.insertedId.toString();
  } catch (err) {
    console.log("Error Creating User Account", err);
    throw "Error Creating User Account";
  }
}

export async function createChat(userID: string): Promise<string> {
  try {
    let userChat = await USERCHATS.findOne({ id: userID });
    if (!isNil(userChat)) {
      let chatID = randomUUID();
      userChat.chats.push({ chatid: chatID, messages: [], surplus: 0 });
      await USERCHATS.updateOne(
        { _id: userChat._id },
        { $set: { chats: userChat.chats } },
      );
      return chatID;
    }
    throw "User Does Not Exist";
  } catch (err) {
    console.log("Error Creating Chat", err);
    if (typeof err === "string") {
      throw err;
    } else {
      throw "Error Creating Chat";
    }
  }
}

export async function storeChats(
  userID: string,
  chatID: string,
  chats: {chats: { role: "user" | "system"; content: string }[], surplus: number},
) {
  try {
    let userChat = await USERCHATS.findOne({ id: userID });
    if (!isNil(userChat)) {
      let chatMessages = userChat.chats.find((chat) => chat.chatid == chatID);
      if (!isNil(chatMessages)) {
        chatMessages.surplus = chats.surplus
        let messages = chats.chats
        chatMessages.messages = messages;
        for (let i = 0; i < userChat.chats.length; i++) {
          if (userChat.chats[i].chatid == chatMessages.chatid) {
            userChat.chats[i] = chatMessages;
          }
        }

        USERCHATS.updateOne(
          { _id: new ObjectId(userID) },
          { $set: { chats: userChat.chats } },
        );
      } else {
        throw "Chat Does Not Exist";
      }
    } else {
      throw "User Does Not Exist";
    }
  } catch (err) {
    console.log("Error Chating =>", err);
    throw "Error Chating";
  }
}

export async function getChats(
  userID: string,
  chatID: string,
): Promise<{chats: { role: "user" | "system"; content: string }[], surplus: number}> {
  try {
    let userChat = await USERCHATS.findOne({id: userID });
    if (!isNil(userChat)) {
      let chatMessages = userChat.chats.find((chat) => chat.chatid == chatID);
      if (!isNil(chatMessages)) {
        return {chats: chatMessages.messages, surplus: chatMessages.surplus};
      } else {
        throw "Chat Does Not Exist";
      }
    } else {
      throw "User Does Not Exist";
    }
  } catch (err) {
    console.log("Error Getting Chats", err);
    throw "Error Getting Chats";
  }
}

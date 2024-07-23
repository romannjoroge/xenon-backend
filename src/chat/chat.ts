import "dotenv/config";
import { getChats, storeChats, vectorSearch } from "../mongo/index.js";
import { createTextEmbeddings } from "../storing-pdf/index.js";
import _ from "lodash";
import { openai } from "../storing-pdf/index.js";
import { isWithinTokenLimit } from "gpt-tokenizer/model/gpt-3.5-turbo";
const {isNil} = _;

export async function sendChat(userID: string, chatID: string, question: string): Promise<string | null> {
    try {
        let chatEmbedding = await createTextEmbeddings(question);

        // Vector search db
        let response = await vectorSearch(chatEmbedding.embedding);
        
    
        // Pipe response to ChatGPT to make it more friendly
        let previousMessages = await getChats(userID, chatID);

        if (isNil(response)) {
            return "Please ask a question about bills"
        } else {
            previousMessages.chats.push({
            role: 'user',
            content: `I am asking this question, ${question}. Use this information to get the answer: ${response.source}. Please make the answer as brief as possible and explain in a very simple way that someone with no civic knowledge can understand`
        })
        }

        let completionMessages = {...previousMessages}
        if(completionMessages.surplus > 0) {
            console.log("Message has surplus ", completionMessages.chats.length, completionMessages.surplus)
            let length = completionMessages.chats.length
            completionMessages.chats = completionMessages.chats.slice(completionMessages.surplus - 1)
        }

        // Make sure chat doesn't pass tokens limit
        let tokenLimit = Number.parseInt(process.env.TOKEN_LIMIT ?? '4000')
        let isPassed = true
        while (isPassed) {
            isPassed = isWithinTokenLimit(completionMessages.chats, tokenLimit) === false;
            if(isPassed) {
                console.log("Message Too Big", completionMessages.chats.length)
                let length = completionMessages.chats.length
                completionMessages.chats = completionMessages.chats.slice(1)
                previousMessages.surplus+=1;
                console.log("Message Reduced", completionMessages.chats.length)
            }
        }
        console.log(completionMessages.chats)
        
        const completion = await openai.chat.completions.create({
            messages: completionMessages.chats,
            model: "gpt-3.5-turbo"
        });
    
        // Add chat
        let chatResponse = completion.choices[0].message.content;
        previousMessages.chats.push({
            role: 'system',
            content: chatResponse ?? ""
        })

        // Store chats
        await storeChats(userID, chatID, previousMessages);
        return chatResponse
    } catch(err) {
        console.log("Error Chating =>", err)
        throw "Error Chating";
    }
}
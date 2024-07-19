import { getChats, storeChats, vectorSearch } from "../mongo";
import { createTextEmbeddings } from "../storing-pdf";
import _ from "lodash";
import { openai } from "../storing-pdf/open-ai";
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
            previousMessages.push({
            role: 'user',
            content: `I am asking this question, ${question}. Use this information to get the answer: ${response.source}. Please make the answer as brief as possible and explain in a very simple way that someone with no civic knowledge can understand`
        })
        }
        
        const completion = await openai.chat.completions.create({
            messages: previousMessages,
            model: "gpt-3.5-turbo"
        });
    
        // Add chat
        let chatResponse = completion.choices[0].message.content;
        previousMessages.push({
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
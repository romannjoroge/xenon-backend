import { Embedding } from "openai/resources";
import { openai } from "./open-ai";

export async function createTextEmbeddings(text: string): Promise<Embedding> {
    try {
        const embedding = await openai.embeddings.create({
            model: "text-embedding-3-large",
            input: text,
        })
        return embedding.data[0];
    } catch(err) {
        console.log("Error Getting Embedding => ", err);
        throw "Error Creating Embedding";
    }
}
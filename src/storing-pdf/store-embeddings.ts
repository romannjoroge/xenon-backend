import "dotenv/config";
import { EMBEDDINGS, IEMBEDDINGS } from "../mongo";
import { createTextEmbeddings } from "./create-text-embeddings";

export async function storeEmbeddings(args: IEMBEDDINGS) {
    try {
        let result = await EMBEDDINGS.insertOne(args);
    } catch(err) {
        console.log("Error Storing Embeddings =>", err);
        throw "Error Storing Embeddings";
    }
}
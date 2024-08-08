import "dotenv/config";
import { EMBEDDINGS, IEMBEDDINGS } from "../mongo/index.js";
import { createTextEmbeddings } from "./create-text-embeddings.js";

export async function storeEmbeddings(args: IEMBEDDINGS) {
    try {
        let result = await EMBEDDINGS.insertOne(args);
    } catch(err) {
        console.log("Error Storing Embeddings =>", err);
        throw "Error Storing Embeddings";
    }
}
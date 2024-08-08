import "dotenv/config";
import { EMBEDDINGS, IEMBEDDINGS } from "../mongo/index.js";

export async function storeEmbeddings(args: IEMBEDDINGS) {
    try {
        await EMBEDDINGS.insertOne(args);
    } catch(err) {
        console.log("Error Storing Embeddings =>", err);
        throw "Error Storing Embeddings";
    }
}

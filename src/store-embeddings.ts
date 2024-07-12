import "dotenv/config";
import { EMBEDDINGS, IEMBEDDINGS } from "./mongo";
import { createTextEmbeddings } from "./create-text-embeddings";

export async function storeEmbeddings(args: IEMBEDDINGS) {
    try {
        let result = await EMBEDDINGS.insertOne(args);
        console.log(result.insertedId);
    } catch(err) {
        console.log("Error Storing Embeddings =>", err);
        throw "Error Storing Embeddings";
    }
}

if(process.env.DEBUG_MODE) {
    async function test() {
        try {
            let text = "I am awesome";
            let embeddings = await createTextEmbeddings(text)
            console.log(await storeEmbeddings({bill: "Test", embedding: embeddings, source: text}))
        } catch(err) {
            console.log("Test Error =>", err);
        }
    }
    test()
}
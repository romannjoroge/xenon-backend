import { createTextEmbeddings } from "./create-text-embeddings";
import { readPDF } from "./read-pdf";
import { storeEmbeddings } from "./store-embeddings";

export async function storePDFEmbeddingsInDB(pdfPath: string, billName: string) {
    try {
        // Read PDF
        let pdfContent = await readPDF(pdfPath);

        // Get Embeddings
        for await (let page of pdfContent) {
            let embeddings = await createTextEmbeddings(page);

            // Store embeddings
            await storeEmbeddings({bill: billName, embedding: embeddings, source: page});
            console.log("Page Stored");
        }
        console.log("Done!");
    } catch(err) {
        console.log("Error Storing PDF In DB => ", err);
        throw "Error Storing PDF In DB";
    }
}

if(process.env.DEBUG_MODE) {
    async function test() {
        try {
            await storePDFEmbeddingsInDB("./bills/Published Information and Communication Technology Authority Bill, 2024..pdf", "Information and Communication Technology Authority Bill");
        } catch(err) {
            console.log("Testing Error =>", err);
        }
    }
    test()
}
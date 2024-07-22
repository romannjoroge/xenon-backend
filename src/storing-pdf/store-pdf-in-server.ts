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
            await storeEmbeddings({bill: billName, embedding: embeddings.embedding, source: page});
            console.log("Page Stored");
        }
        console.log("Done!");
    } catch(err) {
        console.log("Error Storing PDF In DB => ", err);
        throw "Error Storing PDF In DB";
    }
}
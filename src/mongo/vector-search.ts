import { Embedding } from "openai/resources";
import { EMBEDDINGS } from "./db";
import "dotenv/config";
import { createTextEmbeddings } from "../storing-pdf";

//@ts-ignore
export async function vectorSearch(embedding: number[]): Promise<{ bill: string, source: string } | null> {
    try {
        // Define pipeline
        const agg = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "path": "embedding",
                    "queryVector": embedding,
                    "numCandidates": 150,
                    "limit": 1
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'bill': 1,
                    'source': 1,
                    'score': {
                        '$meta': 'vectorSearchScore'
                    }
                }
            }
        ]

        const result = EMBEDDINGS.aggregate(agg);
        for await (let res of result) {
            if(res.score > 0.9) {
                return {bill: res.bill, source: res.source}
            }
        }
    } catch (err) {
        console.log("Error Getting Vectors =>", err);
        throw "Error Getting Vectors";
    }
}
import 'dotenv/config'
import { MongoClient } from 'mongodb'
import { Embedding } from 'openai/resources'

const client = new MongoClient(process.env.MONGO_CONN_STRING!)
const DATABASE = client.db("convergence-stash")

export interface IEMBEDDINGS {
    bill: string,
    embedding: number[],
    source: string
}

export const EMBEDDINGS = DATABASE.collection<IEMBEDDINGS>("embeddings")
import 'dotenv/config'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGO_CONN_STRING!)
const DATABASE = client.db("convergence-stash")

export interface IEMBEDDINGS {
    bill: string,
    embedding: number[],
    source: string
}

export interface IUSERCHATS {
    email: string,
    displayName: string,
    chats: {
        chatid: string,
        messages: {
            role: 'user' | 'system',
            content: string
        }[],
        surplus: number
    }[]
}

export type Body = 'senate' | 'national' | 'executive' | 'individual';
export type Stage = 'memoranda' | 'second-reading';

export interface IBILLS {
    name: string,
    sponsor: string,
    stage: Stage,
    body: Body,
    summary: string,
    feedbackEmail: string,
    pdf: BinaryData
}

export const USERCHATS = DATABASE.collection<IUSERCHATS>("user_chats");
export const EMBEDDINGS = DATABASE.collection<IEMBEDDINGS>("embeddings");
export const BILLS = DATABASE.collection<IBILLS>("bills");
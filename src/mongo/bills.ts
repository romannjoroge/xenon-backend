import { ObjectId } from "mongodb";
import { BILLS, IBILLS, Body, Stage } from "./db.js";
import _ from "lodash";
const {isNil} = _;
import "dotenv/config.js";

export async function createBill(input: IBILLS) {
    try {
        await BILLS.insertOne(input);
    } catch (err) {
        console.log("Error Creating Bill", err);
        throw "Error Creating Bill";
    }
}

interface SearchBillResults {
    _id: ObjectId,
    name: string,
    sponsor: string,
    body: Body,
    stage: Stage,
    summary: string
}

export async function getBills(page: number, size: number): Promise<SearchBillResults[]> {
    try {
        let billsPromise = BILLS.find()
            .limit(size)
            .skip(page * size)
            .project({ name: 1, body: 1, sponsor: 1, stage: 1, summary: 1 });

        let bills: SearchBillResults[] = [];
        for await (let bill of billsPromise) {
            //@ts-ignore
            bills.push(bill);
        }
        return bills
    } catch (err) {
        console.log(err);
        throw "Could Not Get Bills";
    }
}

export async function searchForBill(input: { body?: Body, name?: string }): Promise<SearchBillResults[]> {
    try {
        let findObject: Record<string, any> = {};

        if (input.name) {
            findObject['name'] = input.name
        }
        if (input.body) {
            findObject['body'] = input.body;
        }


        let billsPromise = BILLS.find(findObject).project({ name: 1, body: 1, sponsor: 1, stage: 1, summary: 1 })
        let bills: SearchBillResults[] = [];
        for await (let bill of billsPromise) {
            //@ts-ignore
            bills.push(bill);
        }
        return bills
    } catch (err) {
        console.log(err, "Error Getting Bills");
        throw "Error Getting Bills";
    }
}

export async function getBillDetails(id: string): Promise<IBILLS | null> {
    try {
        let ID = new ObjectId(id);
        let bill = await BILLS.findOne({ _id: ID });
        return bill;
    } catch (err) {
        console.log(err, "Could Not Get Details Of Bill");
        throw "Could Not Get Details Of Bill";
    }
}

export async function getBillFeedbackDetails(id: string): Promise<{email: string, name: string}> {
    try {
        let feedbackDetails = await BILLS.findOne({_id: new ObjectId(id)});

        if(isNil(feedbackDetails)) {
            throw "Bill Does Not Exist";
        }
        if(!process.env.TEST_MODE) {
            return {email: feedbackDetails.feedbackEmail, name: feedbackDetails.name}
        } else {
            return {email: 'roman.njoroge@njuguna.com', name: feedbackDetails.name}
        }
    } catch(err) {
        console.log()
        if (typeof err === 'string') {
            throw err;
        } else {
            throw "Could Not Get Bill Details";
        }
    }
}
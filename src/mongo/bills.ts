import { FindCursor, ObjectId, WithId } from "mongodb";
import { BILLS, IBILLS, Body, Stage } from "./db";

export async function createBill(input: IBILLS) {
    try {
        await BILLS.insertOne(input);
    } catch(err) {
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

export async function searchForBill(input: {body?: Body, name?: string}): Promise<SearchBillResults[]> {
    try {
        let findObject: Record<string, any> = {};

        if(input.name) {
            findObject['name'] = input.name
        }
        if(input.body) {
            findObject['body'] = input.body;
        }


        let billsPromise = BILLS.find(findObject).project({name: 1, body: 1, sponsor: 1, stage: 1, summary: 1})
        let bills: SearchBillResults[] = [];
        for await(let bill of billsPromise) {
            //@ts-ignore
            bills.push(bill);
        }
        return bills
    } catch(err) {
        console.log(err, "Error Getting Bills");
        throw "Error Getting Bills";
    }
}

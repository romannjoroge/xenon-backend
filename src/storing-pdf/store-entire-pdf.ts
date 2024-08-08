import { createBill, IBILLS } from "../mongo/index.js";
import { readFileSync } from "fs";

export async function storeEntirePDF(input: IBILLS) {
    try {
        await createBill(input);
    } catch(err) {
        console.log(err, "Error Storing Entire PDF");
        throw "Error Storing PDF"
    }
}
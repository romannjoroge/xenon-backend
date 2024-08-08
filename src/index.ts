import Express from "express";
import "dotenv/config";
import { createChat, createUserAccount, getBillDetails, searchForBill } from "./mongo/index.js";
import _ from "lodash";
import { sendChat } from "./chat/index.js";
import {
    Webhook,
    WebhookRequiredHeaders,
    WebhookUnbrandedRequiredHeaders,
} from "svix";
import { feedBackSchema } from "./schema/index.js";
const { isNil } = _;

const app = Express();

app.use("/", Express.json());

app.get("/test", (req, res) => {
    res.send("Reachable");
});

app.post("/createUser", async (req, res) => {
    //Don't change this otherwise you won't be able to verify the webhook
    const payload = JSON.stringify(req.body);
    const headers = req.headers;
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("You need a WEBHOOK_SECRET in your .env");
    }

    // Get the Svix headers for verification
    const svix_id = headers["svix-id"];
    const svix_timestamp = headers["svix-timestamp"];
    const svix_signature = headers["svix-signature"];

    //If there are no Svix headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return res
            .status(400)
            .json({ message: "Error occured -- no svix headers" });
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    const moddedHeaders = headers as
        | WebhookRequiredHeaders
        | WebhookUnbrandedRequiredHeaders
        | Record<string, string>;

    try {
        wh.verify(payload, moddedHeaders);
    } catch (err) {
        //console.error(err);
        return res.status(400).json({
            success: false,
            message: err,
        });
    }

    try {
        const userData = JSON.parse(payload);
        console.log(userData);
        const userID = userData.data.id;
        const emailObj = userData.data.email_addresses[0];
        const username = userData.data.username;
        createUserAccount(userID, emailObj.email_address, username);
        console.log("userID=>", userID);
        return res.status(201).json({ userID });
    } catch (error) {
        //console.log(error);
        return res.status(500).json({ message: error });
    }
});


app.get("/searchForBill", async (req, res) => {
    let { body, name } = req.query;

    try {
        //@ts-ignore
        let bills = await searchForBill({ body, name });
        return res.json(bills);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
})

app.get("/getBill/:id", async (req, res) => {
    try {
        let bill = await getBillDetails(req.params.id)
        return res.json(bill);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
})

app.post("/createChat", async (req, res) => {
    let { userID } = req.body;

    try {
        let chatID = await createChat(userID);
        return res.status(201).json({ chatID });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

app.post("/chat", async (req, res) => {
    // Convert chat to embedding
    let { chat, userID, chatID } = req.body;

    try {
        let response = await sendChat(userID, chatID, chat);

        return res.json({ response });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
});

app.post("/feedback", async (req, res) => {
    let feedback = feedBackSchema.safeParse(req.body);
    if(!feedback.success) {
        return res.status(500).json({message: "Invalid Feedback"});
    }
    
    let feedBackData = feedback.data;
    if (feedBackData.length === 0) {
        return res.status(500).json({message: "Feedback Cannot Be Empty"});
    }

    console.log(feedBackData);
    res.send("Feedback sent");
});

app.all("*", (req, res) => {
    res.status(404).json({ message: "Route Does Not Exist" });
});

let port = process.env.PORT ?? 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});

import Express from "express";
import "dotenv/config";
import { createTextEmbeddings } from "./storing-pdf";
import { createChat, createUserAccount, createBill, searchForBill } from "./mongo";
import _ from "lodash";
import { sendChat } from "./chat";
const {isNil} = _;

const app = Express();

app.use('/', Express.json())

app.get('/test', (req, res) => {
    res.send("Reachable")
})

app.post('/createUser', async (req, res) => {
    let {email, displayName} = req.body;

    try {
        let userID = await createUserAccount(email, displayName);
        return res.status(201).json({userID})
    } catch(err) {
        return res.status(500).json({message: err})
    }
})

app.post('/createChat', async (req, res) => {
    let {userID} = req.body;

    try {
        let chatID = await createChat(userID);
        return res.status(201).json({chatID})
    } catch(err) {
        return res.status(500).json({message: err});
    }
});

app.post('/chat', async (req, res) => {
    // Convert chat to embedding
    let {chat, userID, chatID} = req.body;

    try {
        let response = await sendChat(userID, chatID, chat);    
    
        return res.json({response});
    } catch(err) {
        return res.status(500).json({message: err});
    }
})

app.get("/searchForBill", async(req, res) => {
    let {body, name} = req.query;

    try {
        //@ts-ignore
        let bills = await searchForBill({body, name});
        return res.json(bills);
    } catch(err) {
        return res.status(500).json({message: err});
    }
})

app.all('*', (req, res) => {
    res.status(404).json({message: "Route Does Not Exist"});
})

let port = process.env.PORT ?? 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`)
})
import Express from "express";
import "dotenv/config";
import { createTextEmbeddings } from "./storing-pdf";
import { createChat, createUserAccount, vectorSearch } from "./mongo";
import _ from "lodash";
import { sendChat } from "./chat";
import {
  Webhook,
  WebhookRequiredHeaders,
  WebhookUnbrandedRequiredHeaders,
} from "svix";
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
    const emailObj = userData.data.email_addresses[0];
    const username = userData.data.username;
    // console.log(emailObj, username);
    let userID = await createUserAccount(emailObj.email_address, username);
    console.log("userID=>", userID);
    return res.status(201).json({ userID });
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ message: error });
  }
});

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

app.all("*", (req, res) => {
  res.status(404).json({ message: "Route Does Not Exist" });
});

let port = process.env.PORT ?? 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

import "dotenv/config.js";
import { MailerSend } from "mailersend";

const mailsender = new MailerSend({
    apiKey: process.env.MAIL_SENDER_API_KEY
});

export default mailsender;
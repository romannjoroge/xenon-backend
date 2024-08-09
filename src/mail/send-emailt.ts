import { Attachment, EmailParams, Recipient, Sender } from "mailersend";
import fs from "fs";
import mailsender from "./client.js";

export default async function sendEmail(from: string, subject: string, body: string, recepients: string[], attachmentPath: string) {
    try {
        let recepientEmails = recepients.map((e) => new Recipient(e));
        let sender = new Sender(from, "Concerned Citizen");
        let attachment = new Attachment(
            fs.readFileSync(attachmentPath, { encoding: 'base64' }),
            'feedback.pdf',
            'attachment'
          )

        const emailParams = new EmailParams()
            .setFrom(sender)
            .setTo(recepientEmails)
            .setSubject(subject)
            .setHtml(body)
            .setAttachments([attachment])
        
        await mailsender.email.send(emailParams);
    } catch(err) {
        console.log(err);
        throw "Could Not Send Email";
    }
}
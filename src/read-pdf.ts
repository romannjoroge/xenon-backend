import "dotenv/config";
import { readPdfPages } from "pdf-text-reader";

export async function readPDF(pdfPath: string): Promise<string[]> {
    try {
        const pages = await readPdfPages({url: pdfPath});
        let pdfContent = [];
        for (let page of pages) {
            let pageContent = "";
            page.lines.forEach((line) => {
                pageContent = `${pageContent} ${line}`
            })
            pdfContent.push(pageContent);
        }

        return pdfContent;
    } catch(err) {
        console.log("Error Reading PDF =>",err);
        throw "Error Reading PDF";
    }
}
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

if(process.env.DEBUG_MODE) {
    async function test() {
        try {
            let pdf = await readPDF("./bills/Published Information and Communication Technology Authority Bill, 2024..pdf");
            console.log(pdf);
        } catch(err) {
            console.log("Test Error =>", err);
        }
    }
    test()
}
import PdfPrinter from 'pdfmake';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

interface PDFdata {
    serialno: string;
    section: string;
    proposal: string;
    justification: string;
}
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const fonts = {
    Roboto: {
        normal: path.resolve(__dirname, 'fonts/Roboto-Regular.ttf'),
        bold: path.resolve(__dirname, 'fonts/Roboto-Medium.ttf'),
        italics: path.resolve(__dirname, 'fonts/Roboto-Italic.ttf'),
        bolditalics: path.resolve(__dirname, 'fonts/Roboto-MediumItalic.ttf'),
    },
};
const printer = new PdfPrinter(fonts)
/**
 * 
 * @param content A list of objects containing the data to be displayed in the PDF
 */
export function generatePDF(content: PDFdata[], name: string) {
    const docDefinition: any = {
        content: [
            { text: name, style: 'subheader' },
            '',
            {
                style: 'tableExample',
                table: {
                    headerRows: 1,
                    widths: [50, 100, 100, 250],
                    body: [

                        [{ text: 'S/No', style: 'tableHeader', alignment: 'start' }, { text: 'Section of Bill', style: 'tableHeader', alignment: 'start' }, { text: 'Proposal', style: 'tableHeader', alignment: 'start' }, { text: 'Justification', style: 'tableHeader', alignment: 'start' }],
                        ...content.map((item, index) => {
                            return [item.serialno, item.section, item.proposal, item.justification];
                        })
                    ]
                }
            }
        ]
    }
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    return pdfDoc;
}
// const pdfDoc = generatePDF(ct, 'Test PDF');
// pdfDoc.pipe(fs.createWriteStream('output.pdf'));
// pdfDoc.end();
import PdfPrinter = require('pdfmake');
import * as fs from 'fs';
import {content as ct} from './tt';
interface PDFdata {
    serialno: string;
    section: string;
    proposal: string;
    justification: string;
}
const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
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
const pdfDoc = generatePDF(ct, 'Test PDF');
pdfDoc.pipe(fs.createWriteStream('output.pdf'));
pdfDoc.end();
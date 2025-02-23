import axios from 'axios';
import pdfParse from 'pdf-parse';

export async function parsePDF(url) {
  // Fetch the PDF file as an ArrayBuffer
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const dataBuffer = Buffer.from(response.data, 'binary');

  // Use pdf-parse to extract the text
  const data = await pdfParse(dataBuffer);
  return data.text;
}
import fs from "fs";
import pdf from "pdf-parse";

// =====================================
// Extract text from local PDF file
// =====================================
export async function extractPDFText(filePath) {
  const buffer = fs.readFileSync(filePath); // read file

  const data = await pdf(buffer); // parse pdf

  return data.text; // return plain text
}

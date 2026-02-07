import pdf from "pdf-parse";

// =====================================
// Extract text from local PDF file
// =====================================
export async function extractPDFText(buffer) {

  const data = await pdf(buffer); // parse pdf

  return data.text; // return plain text
}

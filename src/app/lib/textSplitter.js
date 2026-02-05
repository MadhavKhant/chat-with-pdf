import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// =====================================
// Split big text → small chunks
// =====================================
export async function splitIntoChunks(text) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 400,      // max chars per chunk
    chunkOverlap: 50,   // overlap for better context
  });

  const chunks = await splitter.splitText(text);

  return chunks; // array of strings
}

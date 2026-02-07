import { extractPDFText } from "./pdfExtractor.js";
import { splitIntoChunks } from "./textSplitter.js";
import { getVectorStore } from "./vectorStore.js";

export async function processPDF(buffer, userId, fileName) {

  const text = await extractPDFText(buffer);
  const chunks = await splitIntoChunks(text);
  const store = await getVectorStore();

  await store.addDocuments(
    chunks.map(chunk => ({
      pageContent: chunk,
      metadata: { userId, fileName },
    }))
  );
}

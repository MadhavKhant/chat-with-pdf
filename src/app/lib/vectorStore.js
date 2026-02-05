import { MongoClient } from "mongodb";
import { embedText } from "./embedding.js";

let client;
let collection;

export async function getVectorStore() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    collection = client.db("pdfCluster").collection("vectors");
  }

  return {
    async addDocuments(docs) {
      for (const doc of docs) {
        const vector = await embedText(doc.pageContent);
        await collection.insertOne({ ...doc, embedding: vector });
      }
    },
  };
}

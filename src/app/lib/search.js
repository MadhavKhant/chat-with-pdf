import { MongoClient } from "mongodb";
import { embedText } from "./embedding.js";

let client;
let collection;

// get mongo connection
async function getCollection() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    collection = client.db("pdfCluster").collection("vectors");
  }
  return collection;
}

// =======================================
// question → embedding → vector search
// =======================================
export async function searchSimilar(question, userId, topK = 2) {
  const col = await getCollection();

  // ⭐ embed question
  const queryVector = await embedText(question);

  // ⭐ MongoDB vector search
  const results = await col
    .aggregate([
      {
        $vectorSearch: {
          index: "vector_index", // index name you created
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 50,
          limit: topK,
          filter: {
            "metadata.userId": userId, // search only this user's docs
          },
        },
      },
    ])
    .toArray();

  // return only text
  return results.map((r) => r.pageContent);
}

import { pipeline } from "@xenova/transformers";

let embedder; // store model globally so it loads only once

// load embedding model
export async function getEmbeddings() {
  if (!embedder) {
    // load MiniLM embedding model
    embedder = await pipeline(
      "feature-extraction",        // task type
      "Xenova/all-MiniLM-L6-v2"    // model name
    );
  }
  return embedder;
}

// convert text → embedding vector
export async function embedText(text) {

  const model = await getEmbeddings(); // get loaded model

  const output = await model(text, {
    pooling: "mean",     // ⭐ VERY IMPORTANT (fix)
    normalize: true      // ⭐ improves similarity
  }); // run model on text

  // output is Tensor, not array
  // Tensor.data gives Float32Array
  const vector = Array.from(output.data); // convert to normal array

  return vector; // ready to store in MongoDB
}

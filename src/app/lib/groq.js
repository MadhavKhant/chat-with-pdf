import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const askGroq = async(question, chunks) => {
    
  const context = chunks.join("\n\n");

    const prompt = `Answer ONLY using the provided context.
    Context:${context}
    Question:${question}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        //{ role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: 300,
      temperature: 0.3, // more deterministic
    });

    return completion.choices[0].message.content;
}

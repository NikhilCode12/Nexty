import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
  organization: process.env.OPENAI_ORG,
});

export async function sendMessageToOpenAI(message) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant. (Assistant: Nexty Assistant)",
      },
      { role: "user", content: message },
    ],
    temperature: 0.7,
    max_tokens: 50,
    frequency_penalty: 0,
  });
  return completion.choices[0];
}

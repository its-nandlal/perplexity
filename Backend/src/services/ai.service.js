import { ChatGoogle } from "@langchain/google";
import { ChatMistralAI } from "@langchain/mistralai";

import { AIMessage, HumanMessage, SystemMessage } from "langchain";

const geminiModel = new ChatGoogle({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const response = await geminiModel.invoke([
    new HumanMessage(
      messages.map((msg) => {
        if (msg.role === "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role === "ai") {
          return new AIMessage(msg.content);
        }
      }),
    ),
  ]);

  return response.text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
            You are a helpful assistant that generates concise, descriptive titles for chat conversations.
            
            Guidelines:
            - Generate a title that is 3-6 words maximum
            - Capture the main topic or intent of the message
            - Use title case (first letter of each word capitalized)
            - Do not use quotes or special characters
            - Make it clear and meaningful
            - Avoid generic titles like "Chat" or "Conversation"
            
            Examples:
            - "How to center a div?" → "CSS Centering Help"
            - "I need help with my React project" → "React Project Assistance"
            - "What's the weather today?" → "Weather Inquiry"
            - "Tell me about JavaScript closures" → "JavaScript Closures Explained"
        `),

    new HumanMessage(`
            Based on this first message: "${message}"
            
            Generate a short, descriptive title (3-5 words) for this chat conversation.
            Return only the title without any additional text or formatting.
        `),
  ]);

  return response.text;
}

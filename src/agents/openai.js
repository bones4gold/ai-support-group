import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getAgentResponse(agent, userMessage, conversationHistory = []) {
  const messages = [
    { role: "system", content: agent.persona },
    ...conversationHistory.map((msg) => ({
      role: msg.sender === agent.name ? "assistant" : "user",
      content: `${msg.sender}: ${msg.text}`
    })),
    { role: "user", content: `${agent.name}, what do you want to say next?` }
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
  });

  return response.choices[0].message.content.trim();
}

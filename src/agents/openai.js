import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for frontend calls
});

export async function getAgentResponse(agent, prompt, history = []) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: agent.prompt },
        ...history.map((m) => ({
          role: m.sender === 'You' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: prompt }
      ],
      temperature: 0.8
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("🔴 OpenAI error:", error);
    alert("OpenAI error: " + error.message);
    return "Sorry, I had trouble replying.";
  }
}

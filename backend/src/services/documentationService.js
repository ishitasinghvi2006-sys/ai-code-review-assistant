const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function generateDocumentation(code, language) {
  const prompt = `You are a technical documentation writer. Given the following ${language} code, write clear, concise documentation explaining:
1. What the code does overall (2-3 sentences)
2. For each function/method: its purpose, parameters, and return value
3. For each class: its purpose and what it manages

Format your response as clean Markdown. Do not include the original code in your response, just the documentation. Do not wrap your response in markdown code fences.

Code:
\`\`\`${language}
${code}
\`\`\``;

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content.trim();
}

module.exports = { generateDocumentation };
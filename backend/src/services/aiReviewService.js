const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.XAI_API_KEY,
  baseURL: 'https://api.x.ai/v1',
});

async function runAiReview(code, language) {
  const prompt = `You are an expert code reviewer. Review the following ${language} code and identify issues.

For each issue found, classify it into exactly one of these categories: "bug", "code-smell", "performance", "security", "best-practice".

Respond with ONLY a valid JSON array (no markdown formatting, no explanation text before or after), where each item has this exact shape:
{
  "category": "bug" | "code-smell" | "performance" | "security" | "best-practice",
  "message": "short description of the issue",
  "suggestion": "specific suggestion for how to fix or improve it",
  "severity": "high" | "medium" | "low"
}

If the code has no notable issues, respond with an empty array: []

Code to review:
\`\`\`${language}
${code}
\`\`\``;

  const response = await client.chat.completions.create({
    model: 'grok-3',
    messages: [{ role: 'user', content: prompt }],
  });

  const rawText = response.choices[0].message.content.trim();

  const cleaned = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

  try {
    const issues = JSON.parse(cleaned);
    return Array.isArray(issues) ? issues : [];
  } catch (err) {
    console.error('Failed to parse AI review response:', rawText);
    return [];
  }
}

module.exports = { runAiReview };
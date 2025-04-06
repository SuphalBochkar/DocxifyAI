import { OpenAI } from "openai";

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractDocumentData(
  documentText: string,
  documentUrl?: string
): Promise<any> {
  const prompt = `
You are a document extraction assistant.
Extract the following information from the document text provided, and return only valid JSON in the following format:
{
  "details": {
    "invoiceNumber": "string",
    "invoiceDate": "string",
    "weight": number,
    "name": "string"
  },
  "items": {
    "item1": {
      "name": "string",
      "quantity": number,
      "price": number
    },
    "item2": {
      "name": "string",
      "quantity": number,
      "price": number
    }
  }
}
Document text:
"""${documentText}"""

${documentUrl ? `Document URL: ${documentUrl}` : ""}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful document extraction assistant. Analyze the document text and extract structured data. If a document URL is provided, consider it for additional context.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const message = response.choices[0].message?.content;
  if (!message) throw new Error("No response from OpenAI");

  console.log("OpenAI response:", message);

  try {
    return JSON.parse(message);
  } catch (e) {
    console.error("JSON parse error", e);
    throw new Error("Failed to parse OpenAI response as JSON");
  }
}

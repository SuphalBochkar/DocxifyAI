import { OpenAI } from "openai";
import { getSystemPrompt } from "./prompts";
import { processChunks, splitIntoChunks } from "./embedding";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function cleanJSONOutput(raw: string): string {
  return raw.replace(/```json|```/g, "").trim();
}

export async function getJSONFormatData(
  documentText: string,
  getPromptFunction: (
    documentText: string,
    documentUrl: string,
    extractedData?: JSON
  ) => string,
  documentUrl: string,
  extractedData?: any
): Promise<any> {
  const userPrompt = getPromptFunction(
    documentText,
    documentUrl,
    extractedData
  );

  console.log("[OpenAI User Prompt]:", userPrompt);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: getSystemPrompt() },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });

    const rawMessage = response.choices[0].message?.content;

    if (!rawMessage) {
      throw new Error("No response content from OpenAI.");
    }

    const cleaned = cleanJSONOutput(rawMessage || "");
    console.log("[OpenAI Raw Response]:", rawMessage);
    console.log("[Parsed JSON]:", cleaned);

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("❌ Failed to fetch or parse OpenAI response:", error);
    throw new Error("Error processing document with OpenAI.");
  }
}

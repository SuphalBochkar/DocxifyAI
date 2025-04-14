import { openai } from "./OpenAPI";
import { prisma } from "./prisma";

export function splitIntoChunks(text: string, chunkSize: number): string[] {
  const words = text.trim().split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }
  return chunks;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return response.data[0].embedding;
}

export async function processChunks(chunks: string[], documentId: string) {
  try {
    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);
      await prisma.embedding.create({
        data: {
          documentId,
          embedding,
          content: chunk,
        },
      });
    }
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error("Error generating embeddings");
  }
}

export async function processDocumentForEmbeddings(
  documentText: string,
  documentId: string,
  getPromptFunction: (
    documentText: string,
    documentUrl: string,
    extractedData?: JSON
  ) => string,
  documentUrl: string,
  extractedData?: JSON
): Promise<any> {
  const userPrompt = getPromptFunction(
    documentText,
    documentUrl,
    extractedData
  );

  const chunks = splitIntoChunks(documentText, 1000);
  await processChunks(chunks, documentId);
}

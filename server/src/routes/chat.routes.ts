import express, { Request, Response } from "express";
import { Document as PrismaDocument } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { openai } from "../lib/OpenAPI";

export const router = express.Router();

const threadMap = new Map<string, string>();
const assistantMap = new Map<string, string>();

const getSystemPrompt = (document: PrismaDocument) => {
  return `You are a chat-based AI assistant integrated into DoxifyAI, an AI-powered document extraction and validation system. Your role is to help users interact with structured data extracted from a specific PDF document.
    Your responsibilities include the following:
    1. Answer Questions from Document:
    - Answer questions based on the document's content and the extracted data.
    - When asked about a specific field (e.g., "What is the invoice number?"), respond with the key-value pair in JSON format like: {"InvoiceNo": "INV-12345"} using the exact key from the extracted JSON data.
    - If the requested field exists in the document but is not in the extracted data, try to locate it in the document content.
    2. Suggest Missing Values:
    - If a field is missing or undefined in the extracted data, infer a suitable value from the document content.
    3. Query to change the document or update in the document:
    - If a user asks to change a key in the document, respond with  highlighting the change between two "%%" symbols in a format similar to Ruby's HashDiff JSON comparison.
    4. Answer Document-Specific Queries:
    - Respond to user questions strictly related to the contents, fields, or data extracted from the current document.
    5. Maintain Accuracy and Clarity:
    - Ensure all your answers are concise, accurate, and directly relevant to the document being processed.
    6. Handle Unrelated Questions Appropriately:
    - If a user asks something unrelated to this document, politely decline and explain: "I can only help with questions related to the current document."

    Behavior Rules:
    - Do not assume information that is not present in the document.
    - Do not answer anything outside the scope of the provided document.
    - Stay focused on helping users validate and retrieve accurate information from this document.

    You are part of a validation and automation system designed to streamline GoComet's document workflows and reduce manual intervention. Your guidance should reflect that intelligence and reliability.
    You are provided with:
    - The full content of the document: ${document.content || "Not available"}
    - Extracted key-value data in JSON format: ${JSON.stringify(
      document.extractedData
    )}`;
};

// const getSystemPrompt = (document: PrismaDocument) => {
//   const prompt = `You are an AI document analysis assistant with expertise in extracting and interpreting information from documents. You are currently analyzing a specific document with the following details:

//     Your primary responsibilities are:

//     1. Document Analysis:
//     Your role involves thoroughly analyzing the document’s content and any extracted data to deliver accurate and insightful information. You should be able to identify key elements, patterns, and relationships within the data, and highlight them effectively. When relevant, you must also recognize and point out any inconsistencies, gaps, or missing details in the document.
//     2. Query Handling:
//     You are expected to handle only those questions that are directly related to the document’s content or its extracted data. For queries involving validation, refer to the validation data if it’s available. For extraction-related questions, draw insights from both the raw document content and the structured data. If a question relates to missing information, consult the missingData field when it exists.
//     3. Response Guidelines:
//     Always aim to be precise, factual, and clear in your responses. For complex answers, consider using bullet points or numbered lists to organize the information effectively. Reference specific sections or data points from the document wherever applicable. If a piece of information is unavailable, state that explicitly. When discussing validations, clearly explain the status and highlight any issues or discrepancies found.
//     4. Document Context:
//     ${document.content ? `Document Content: ${document.content}` : ""}
//     ${
//       document.extractedData
//         ? `Extracted Data: ${JSON.stringify(document.extractedData)}`
//         : ""
//     }

//     Remember:
//     Always stay focused on the documents content and the extracted information when crafting responses. Maintain a professional and helpful tone throughout. If certain information is unavailable, be transparent about those limitations. Where possible, leverage validation and missing data to deliver more complete and insightful answers. Lastly, ensure your communication remains clear, concise, and well-structured.`;

//   return prompt;
// };

const isQueryRelevantToDocument = (query: string): boolean => {
  const irrelevantKeywords = [
    "weather",
    "stock market",
    "sports",
    "news",
    "politics",
    "recipe",
    "your personal",
    "your opinion",
    "off topic",
  ];

  const lowerQuery = query.toLowerCase();
  return !irrelevantKeywords.some((keyword) => lowerQuery.includes(keyword));
};

async function createAssistantForDocument(document: PrismaDocument) {
  const assistant = await openai.beta.assistants.create({
    name: `Document Assistant`,
    instructions: `You are a helpful assistant that analyzes documents. You can help users understand the content of their documents, extract key information, and answer questions about the document's content. You have access to the document's content and can analyze both text and JSON data.`,
    model: "gpt-4-turbo-preview",
    tools: [{ type: "code_interpreter" }, { type: "file_search" }],
  });
  return assistant;
}

router.post("/thread", async (req: Request, res: Response) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      res.status(400).json({ error: "Document ID is required" });
      return;
    }

    let assistantId = assistantMap.get(documentId);
    if (!assistantId) {
      const document = await prisma.document.findUnique({
        where: { id: documentId },
      });

      if (!document) {
        res.status(404).json({ error: "Document not found" });
        return;
      }

      const assistant = await createAssistantForDocument(document);
      assistantId = assistant.id;
      assistantMap.set(documentId, assistantId);
    }

    let threadId = threadMap.get(documentId);
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
      threadMap.set(documentId, threadId);

      // Add welcome message
      await openai.beta.threads.messages.create(threadId, {
        role: "assistant",
        content:
          "Hello! I'm your document assistant. What would you like to know about this document?",
      });
    }

    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        assistantId: assistantId,
        threadId: threadId,
      },
    });

    res.status(200).json({
      threadId,
      assistantId,
    });
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({ error: "Failed to create thread" });
  }
});

router.post("/message", async (req: Request, res: Response) => {
  try {
    const { documentId, message, threadId, assistantId } = req.body;

    if (!documentId || !message || !threadId || !assistantId) {
      res.status(400).json({
        error: "Document ID, message, thread ID, and assistant ID are required",
      });
      return;
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    if (!isQueryRelevantToDocument(message)) {
      res.status(200).json({
        response:
          "I'm specifically designed to help with information in this document. Please ask a question related to the document content, and I'll be happy to assist you.",
      });
      return;
    }

    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
      instructions: getSystemPrompt(document),
    });

    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

    while (
      runStatus.status === "queued" ||
      runStatus.status === "in_progress"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    if (runStatus.status === "completed") {
      const messages = await openai.beta.threads.messages.list(threadId);

      const assistantMessages = messages.data
        .filter((msg) => msg.role === "assistant")
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      if (assistantMessages.length > 0 && assistantMessages[0].content) {
        let responseText = "";

        for (const contentPart of assistantMessages[0].content) {
          if (contentPart.type === "text") {
            responseText += contentPart.text.value;
          }
        }

        res.status(200).json({
          response: responseText,
          threadId,
          assistantId,
        });
        return;
      }
    }

    res.status(500).json({ error: "Failed to get response from assistant" });
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

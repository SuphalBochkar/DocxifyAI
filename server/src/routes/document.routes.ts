import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
// @ts-ignore
import pdfParse from "pdf-parse";
import { OpenAI } from "openai";
import { prisma } from "../lib/prisma";

export const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads");
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only PDF files for now
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to extract text from a PDF file
async function extractTextFromPDF(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const result = await pdfParse(dataBuffer);
  return result.text;
}

// Helper function to analyze text and detect missing fields
async function detectMissingFields(
  text: string
): Promise<{ extractedData: any; missingFields: string[] }> {
  // Simple regex patterns for common invoice fields
  const patterns = {
    invoice_number: /invoice\s*#?\s*:?\s*([A-Z0-9\-]+)/i,
    date: /date\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
    due_date: /due\s*date\s*:?\s*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i,
    total_amount: /total\s*:?\s*\$?\s*([\d,]+\.\d{2})/i,
    vendor_name: /vendor\s*:?\s*([A-Za-z0-9\s,\.]+)/i,
  };

  const extractedData: any = {};
  const missingFields: string[] = [];

  // Try to extract each field using regex
  for (const [field, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      extractedData[field] = match[1].trim();
    } else {
      missingFields.push(field);
    }
  }

  return { extractedData, missingFields };
}

/**
 * @route POST /api/v1/documents/upload
 * @description Upload a document for parsing
 * @access Public
 */
router.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Extract text from the PDF
      const filePath = req.file.path;
      const text = await extractTextFromPDF(filePath);

      // Analyze the text to detect missing fields
      const { extractedData, missingFields } = await detectMissingFields(text);

      // Create a document record in the database
      const document = await prisma.document.create({
        data: {
          fileName: req.file.filename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
          storageUrl: filePath,
          content: text,
          extractedData,
          missingFields,
        },
      });

      res.status(201).json({
        id: document.id,
        fileName: document.fileName,
        extractedData,
        missingFields,
      });
    } catch (error: any) {
      console.error("Error uploading document:", error);
      res.status(500).json({ error: "Upload failed", details: error.message });
    }
  }
);

/**
 * @route GET /api/v1/documents/:id
 * @description Get document details by ID
 * @access Public
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.status(200).json({
      id: document.id,
      fileName: document.fileName,
      originalName: document.originalName,
      extractedData: document.extractedData,
      missingFields: document.missingFields,
      createdAt: document.createdAt,
    });
  } catch (error: any) {
    console.error("Error fetching document:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch document", details: error.message });
  }
});

/**
 * @route POST /api/v1/documents/:id/chat
 * @description Process AI chat for missing data
 * @access Public
 */
router.post("/:id/chat", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Retrieve the document
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Construct prompt for OpenAI
    const prompt = `
      Analyze the following document text:
      ${document.content}

      The user reports that "${query}" is missing.
      Extract the correct value and respond in JSON format:
      { "field": "[field_name]", "value": "[extracted_value]" }
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const aiResponse = response.choices[0].message.content;

    // Save the chat interaction
    const chat = await prisma.chat.create({
      data: {
        query,
        response: { text: aiResponse },
        documentId: document.id,
      },
    });

    // Try to parse the AI response as JSON
    try {
      const parsedResponse = JSON.parse(aiResponse || "{}");
      res.status(200).json(parsedResponse);
    } catch (e) {
      // If parsing fails, return the raw response
      res.status(200).json({
        text: aiResponse,
      });
    }
  } catch (error: any) {
    console.error("Error processing chat:", error);
    res
      .status(500)
      .json({ error: "AI processing failed", details: error.message });
  }
});

/**
 * @route GET /api/v1/documents
 * @description List all documents
 * @access Public
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const documents = await prisma.document.findMany({
      select: {
        id: true,
        originalName: true,
        extractedData: true,
        missingFields: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(documents);
  } catch (error: any) {
    console.error("Error listing documents:", error);
    res
      .status(500)
      .json({ error: "Failed to list documents", details: error.message });
  }
});

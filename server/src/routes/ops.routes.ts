import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getJSONFormatData } from "../lib/OpenAPI";
import { hashDiffFormat } from "../lib/diff";
import { getJSONValidationPrompt } from "../lib/prompts";
import { documentExtractionHandler } from "../handlers/extract.handler";
import { documentProcessingHandler } from "../handlers/process.handler";

export const router = express.Router();

/**
 * @route POST /api/v1/ops/verify/:id
 * @description Verify document with OpenAI and update document in Prisma
 */

router.post("/verify/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const document = await prisma.document.findUnique({
      where: {
        id,
      },
    });

    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    const extractedText = await documentExtractionHandler({ document });
    const processedData = await documentProcessingHandler({
      document,
      extractedText,
      isVerification: true,
    });

    res.status(200).json({
      message: "Document verified successfully",
      documentId: id,
      missingData: processedData?.missingData || {},
    });
  } catch (error) {
    console.error("Error verifying document:", error);
    res.status(500).json({
      error: "Failed to verify document",
      details: (error as Error).message,
    });
  }
});

/**
 * @route POST /api/v1/ops/validate/:id
 * @description Process document with OpenAI and update document in Prisma
 */

router.post("/validate/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: "Missing document ID" });
    return;
  }

  try {
    const document = await prisma.document.findUnique({
      where: {
        id,
      },
      select: {
        extractedData: true,
        content: true,
        url: true,
      },
    });

    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    const rawText = document.content ?? "";
    const documentUrl = document.url ?? "";
    const existingData =
      typeof document.extractedData === "string"
        ? JSON.parse(document.extractedData)
        : document.extractedData;

    const newExtractedData = await getJSONFormatData(
      rawText,
      getJSONValidationPrompt,
      documentUrl,
      existingData
    );

    console.log("old: ", document.extractedData);
    console.log("new: ", newExtractedData);

    const differences = hashDiffFormat(
      {
        generalData: existingData?.generalData || {},
        groupedData: existingData?.groupedData || {},
      },
      {
        generalData: newExtractedData?.generalData || {},
        groupedData: newExtractedData?.groupedData || {},
      }
    );

    // const updatedDocument = await prisma.document.update({
    //   where: { id },
    //   data: { extractedData: newExtractedData },
    // });

    res.status(200).json({
      message: "Document validated successfully",
      documentId: id,
      differences,
      extractedData: newExtractedData,
    });
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({
      error: "Failed to process document",
      details: (error as Error).message,
    });
  }
});

/**
 * @route POST /api/v1/ops/validation-update/:id
 * @description Update document validation status based on user action
 */

router.post("/validation-update/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, validatedData } = req.body;

  console.log("validatedData: ", validatedData);
  console.log("action: ", action);

  if (!id || !action || !validatedData) {
    res.status(400).json({ error: "Missing required parameters" });
    return;
  }

  try {
    const document = await prisma.document.findUnique({
      where: { id },
      select: { extractedData: true },
    });

    if (!document) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    if (action === "approve") {
      await prisma.document.update({
        where: { id },
        data: {
          extractedData: validatedData,
          validationData: {},
          missingData: {},
        },
      });
    }

    res.status(200).json({
      message: `Document ${action}d successfully`,
      documentId: id,
    });
  } catch (error) {
    console.error("Error updating validation:", error);
    res.status(500).json({
      error: "Failed to update validation",
      details: (error as Error).message,
    });
  }
});

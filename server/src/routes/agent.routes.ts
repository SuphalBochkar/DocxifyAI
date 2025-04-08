import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { getJSONFormatData } from "../lib/OpenAPI";
import { hashDiffFormat } from "../lib/diff";

export const router = express.Router();

/**
 * @route POST /api/v1/agent/validate/:id
 * @description Process document with OpenAI and update document in Prisma
 */

router.post("/validate/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

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

    const newExtractedData = await getJSONFormatData(
      document.content ?? "",
      document.url ?? undefined
    );

    const differences = hashDiffFormat(
      document.extractedData || {},
      newExtractedData
    );

    // const'p; updatedDocument = await prisma.document.update({
    //   where: { id },
    //   data: { extractedData: newExtractedData },
    // });

    res.status(200).json({
      message: "Document validated successfully",
      documentId: id,
      differences,
    });
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({
      error: "Failed to process document",
      details: (error as Error).message,
    });
  }
});

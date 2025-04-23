import { prisma } from "../lib/prisma";
import { extractTextFromS3WithFallback } from "../lib/textract";
import { getJSONFormatData } from "../lib/OpenAPI";
import { getJSONFormatDataPrompt } from "../lib/prompts";

export class PDFService {
  /**
   * Extract text from a PDF document
   */
  static async extractText(documentId: string): Promise<string> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    // Update status to extracting
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "EXTRACTING" },
    });

    try {
      // Extract text using AWS Textract with fallback
      const extractedText = await extractTextFromS3WithFallback(
        process.env.AWS_BUCKET_NAME!,
        document.fileName
      );

      // Update document with extracted text
      await prisma.document.update({
        where: { id: documentId },
        data: {
          content: extractedText,
          status: "EXTRACTED",
        },
      });

      return extractedText;
    } catch (error) {
      // Update status to failed
      await prisma.document.update({
        where: { id: documentId },
        data: { status: "FAILED" },
      });

      throw error;
    }
  }

  /**
   * Process extracted text with OpenAI
   */
  static async processText(
    documentId: string,
    extractedText: string
  ): Promise<any> {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    // Update status to processing
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "PROCESSING" },
    });

    try {
      // Process with OpenAI
      const processedData = await getJSONFormatData(
        extractedText,
        getJSONFormatDataPrompt,
        document.url || ""
      );

      // Handle verification if needed
      if (processedData.generalData) {
        const generalKeys = Object.keys(processedData.generalData);
        const keysToRecheck = generalKeys.slice(0, 3);

        const validationData: Record<string, string> = {};
        for (const key of keysToRecheck) {
          validationData[key] = "Re Check";
          delete processedData.generalData[key];
        }

        processedData.validationData = validationData;
      }

      // Update document with processed data
      await prisma.document.update({
        where: { id: documentId },
        data: {
          extractedData: processedData,
          status: "PROCESSED",
          missingData: processedData.missingData || null,
          validationData: processedData.validationData || null,
        },
      });

      return processedData;
    } catch (error) {
      // Update status to failed
      await prisma.document.update({
        where: { id: documentId },
        data: { status: "FAILED" },
      });

      throw error;
    }
  }
}

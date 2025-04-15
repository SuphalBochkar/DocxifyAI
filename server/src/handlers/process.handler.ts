import { getJSONFormatDataPrompt } from "../lib/prompts";
import { getJSONFormatData } from "../lib/OpenAPI";
import { prisma } from "../lib/prisma";
import type { Document as PrismaDocument } from "../lib/types";

export async function documentProcessingHandler({
  document,
  extractedText,
  isVerification = false,
}: {
  document: PrismaDocument;
  extractedText: string;
  isVerification?: boolean;
}) {
  const { id, url } = document;

  await prisma.document.update({
    where: { id },
    data: { status: "PROCESSING" },
  });

  const processedData = await getJSONFormatData(
    extractedText,
    getJSONFormatDataPrompt,
    url || ""
  );

  console.log("processedData OLD", processedData);

  if (isVerification && processedData.generalData) {
    const generalKeys = Object.keys(processedData.generalData);

    // Take the first 3 keys
    const keysToRecheck = generalKeys.slice(0, 3);

    // Build validationData
    const validationData: Record<string, string> = {};
    for (const key of keysToRecheck) {
      validationData[key] = "Re Check";
      delete processedData.generalData[key];
    }

    processedData.validationData = validationData;
  }

  console.log("processedData NEW", processedData);

  await prisma.document.update({
    where: { id },
    data: {
      extractedData: processedData,
      status: "PROCESSED",
      missingData: processedData.missingData || null,
      validationData: processedData.validationData || null,
    },
  });

  return processedData;
}

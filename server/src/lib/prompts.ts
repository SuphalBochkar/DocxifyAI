export function getSystemPrompt() {
  const prompt = `
    You are a highly intelligent AI assistant specialized in extracting structured data from invoice documents. Analyze the URL of the provided Amazon S3 bucket containing the invoice document. Be fully aware that invoice formats, field labels, and layouts may vary significantly. Your goal is to accurately extract context-driven information, using a deep understanding of typical invoice structures and the semantics of business documents. To assist you, the raw extracted text content of the document will also be provided.
    Your task is to intelligently extract and organize the invoice content into a clean, flat JSON structure. Adapt dynamically to variations in terminology, field positions, and formatting by leveraging contextual clues, spatial proximity, and common invoice conventions.

    ⚠️ NOTE:
        Document layouts and language can differ greatly. Use your contextual and semantic understanding to detect and normalize key information, even when labels or structure change.
    `;

  return prompt;
}

export function getJSONFormatDataPrompt(
  documentText: string,
  documentUrl: string
) {
  const prompt = `
    📝 INPUTS:
    You will be provided with:
    1. The raw extracted text from an invoice (via OCR or PDF parser).
    2. A URL pointing to the original invoice PDF stored in an Amazon S3 bucket.

    🎯 OBJECTIVE:
    Extract and return all available general information in three distinct sections:
    1. General Data:
    This section includes all available data generated in the document, such as key-value pairs and other general information. It also covers data that is not in a table format or grouped together, as well as simpler data where only keys and values are present without complex structure.
    2. Table or Grouped Data:
    This section covers data that is structured in tables or grouped forms, where the data is categorized into rows or sections that differ from the general data. It focuses on tabular or grouped information. Use context and pattern matching to correctly split rows, even if tables are unstructured in raw text.
    3. Missing Data:
    This section identifies instances where data is incomplete. It includes two cases:
    - Keys present, values missing: When the keys are available but their corresponding values are missing.
    - Values present, keys missing: When values exist but the associated keys are missing or undefined.
    These sections will be handled using a dynamic schema that adapts to real-world document variations.

    Format:
    {
      "generalData": {
        // All key-value pairs from the document that aren't in tables or grouped formats
      },
      "groupedData": {
        // All tabular or grouped information with consistent structure
      },
      "missingData": {
        // Fields where keys exist but values are missing, or values exist but keys are unclear
      }
    }

    📌 FORMAT REQUIREMENTS:
    - Return output as a flat JSON object with no extra text or comments.
    - Organize the response with:
      - Top-level key-value pairs
      - Use "Missing" for missing fields
      - Structured arrays for "groupedData"
    - All values must be strings (except arrays)
    - Use consistent "camelCase" for all keys

    🧠 THINKING & INTELLIGENCE:
    - Use flexible and intelligent matching — detect field meanings even from partial matches or unusual phrasing
    - Avoid duplicating irrelevant content like headers, footers, disclaimers, or page numbers
    - If a field or section is completely missing or not applicable, mark it as "Missing" or return an empty array
    - Maintain a clean, structured, and readable JSON format
    - Apply semantic understanding to normalize variations in terminology across different invoice formats
    - Use contextual clues to correctly associate values with their corresponding fields
    - Handle edge cases gracefully, such as multi-page documents or unusual formatting

    📄 ${documentUrl ? `Document URL: ${documentUrl}` : ""}

    📝 Raw Extracted Text from the document:

    """${documentText}"""
    `;

  return prompt;
}

export function getJSONValidationPrompt(
  documentText: string,
  documentUrl: string,
  extractedData?: JSON
) {
  const prompt = `
    📝 INPUTS:
    You will be provided with:
    1. The raw extracted text from an invoice (via OCR or PDF parser).
    2. An already extracted key-value pair JSON data from the document.
    3. A URL pointing to the original invoice PDF stored in an Amazon S3 bucket.
    format of previously generated json
    JSON Format (Input): {
      "generalData": {
        // All key-value pairs from the document that aren't in tables or grouped formats
      },
      "groupedData": {
        // All tabular or grouped information with consistent structure
      },
      "missingData": {
        // Fields where keys exist but values are missing, or values exist but keys are unclear
      }
      "validationData": {
        // All key-value pairs from the document that are definitively present in the document
      },
    }

    Important Note:
    - Since you are being provided with already extracted JSON data, do not modify any existing keys in this JSON when giving response. You may re-evaluate or correct the values as needed, but maintain all original key names exactly as they appear in the input JSON to ensure consistency and compatibility.

    🎯 OBJECTIVE:
    Is to extract the data that is in validationData and missingData sections of the JSON. The goal is to intelligently verify and clean the data.
    1. General Data:
    This section includes all available data generated in the document, such as key-value pairs and other general information.
    2. Table or Grouped Data:
    This section covers data that is structured in tables or grouped forms, where the data is categorized into rows or sections that differ from the general data.
    3. Missing Data:
    This section identifies instances where data is incomplete. It includes two cases:
    - Keys present, values missing
    - Values present, keys missing
    4. Validation Data:
    This section includes the keys and values that are definitively present in the document but were not captured in the already available extracted key-value JSON data.

    Carefully analyze the provided extracted text, the already available extracted key-value JSON data, and the original document URL.
    Your goal is to handle the missingData and validationData intelligently and accurately:

    1. For any keys present in validationData, verify if they actually exist in the document. If they exist in the document, add these keys and their values to the generalData section of the final output without modifying the key names. The validationData keys are assumed to be present in the document, so include them in the generalData section.
    2. Similarly, check the keys in missingData. If any of these keys have values that can be found in the document, add them to the appropriate section (generalData or groupedData) based on their type.

    ⚠️ Important: If any field from missingData or validationData cannot be verified as present in the document (neither in extracted text nor in existing JSON data), then completely remove that field — it should not appear in the final output at all. After processing, do not include missingData and validationData as a separate key or section in the final output. Only include the correctly verified and cleaned data organized in generalData and groupedData.

    📌 FORMAT REQUIREMENTS:
    - Return output as a flat JSON object with no extra text or comments.

    Output Format:
    {
      "generalData": {
      },
      "groupedData": {
      },
    }

    🧠 THINKING & INTELLIGENCE:
    - Use flexible and intelligent matching — detect field meanings even from partial matches or unusual phrasing
    - Avoid duplicating irrelevant content like headers, footers, disclaimers, or page numbers
    - Maintain a clean, structured, and readable JSON format
    - Apply semantic understanding to normalize variations in terminology across different invoice formats
    - Use contextual clues to correctly associate values with their corresponding fields
    - Handle edge cases gracefully, such as multi-page documents or unusual formatting

    📄 Document URL (Original Invoice PDF stored in Amazon S3):
    ${documentUrl ? `${documentUrl}` : "Not Available"}

    📝 Raw Extracted Text from the Document (via OCR or PDF Parser):
    """
    ${documentText}
    """

    📝 Pre-Extracted JSON Data (Already available key-value pairs from the document):
    """
    ${JSON.stringify(extractedData)}
    """
    `;

  return prompt;
}

//   const prompt = `
//     You are a document extraction assistant.
//     Extract the following information from the document text provided, and return only valid JSON in the following format:
//     {
//         "details": {
//             "invoiceNumber": "string",
//             "invoiceDate": "string",
//             "weight": number,
//             "name": "string"
//         },
//         "items": {
//             "item1": {
//             "name": "string",
//             "quantity": number,
//             "price": number
//             },
//             "item2": {
//             "name": "string",
//             "quantity": number,
//             "price": number
//             }
//         }
//     }
//     Document text:
//     """${documentText}"""
//     ${documentUrl ? `Document URL: ${documentUrl}` : ""}`;

//   const prompt = `
//   Analyze the URL of the provided Amazon S3 bucket containing the invoice document. Be fully aware that the document's formats, field labels, and layouts may vary greatly from one file to another. Despite these variations, your objective is to extract specific, context-driven information with precision, leveraging both the structure and semantics of the content. Additionally, I will also provide the raw extracted text content of the document to assist in this process.

//   Your task is to intelligently extract and structure the following key data points into a well-organized JSON output. Adapt to variations in labels, locations, terminology, or formatting by inferring the correct information based on contextual clues, proximity, and typical placement in invoices.

//   Extract the following information:

//   1. Document Identification:
//   - document_type: Determine and capture the type of document (examples include "Invoice", "Tax Invoice", "Credit Note", "Receipt", etc.).
//   - invoice_number: Extract the primary identifier for the document (may appear as "Invoice No.", "Inv #", "Document ID", "Bill No.", etc.).

//   2. Issuer/Vendor Information (Details of the entity generating the invoice):
//   - vendor_name: Extract the full name of the issuing company or individual.
//   - vendor_address: Extract the complete physical address of the vendor.
//   - vendor_tax_id: Extract any available tax identification numbers (such as "VAT ID", "GSTIN", "PAN", "Tax ID"). Capture all available if there are multiple.
//   - vendor_contact: Extract all available contact details such as phone numbers, email addresses, and website URLs.

//   3. Recipient/Customer Information (Details of the entity receiving the invoice):
//   - customer_name: Extract the full name of the customer or recipient.
//   - customer_address: Extract the complete address of the customer.
//   - customer_tax_id: Extract any available tax identifiers for the customer.
//   - customer_contact: Extract available customer contact information (phone, email, etc.).
//   - customer_account_number: Extract any customer-specific account number or reference code, if mentioned.

//   4. Dates:
//   - invoice_date: Extract the date the document was issued.
//   - due_date: Extract the date by which payment is due (look for labels like "Payment Due", "Due Date", "Payment Terms").
//   - service_period: Extract the date range representing the period of service or goods supplied (if available). Look for labels like "Period", "Date Range", "Service Dates".

//   5. Line Items / Detailed Breakdown of Products or Services:
//   - Instruction: Identify the main table or section that lists the products or services. Extract every row present in this section comprehensively.
//   - line_items: This should be an array of objects, where each object corresponds to a row in the line items table. Extract the following (based on the available columns):

//   Fields to include within each line item object:
//   - description: Extract the description of the product or service.
//   - quantity: Extract the quantity or units specified.
//   - unit_price: Extract the price per unit.
//   - line_total or amount: Extract the total for that line (calculated as quantity multiplied by unit price).
//   - Additionally, capture any other relevant fields available within the line item table such as item_code, discount, tax_rate, unit_of_measure, etc.

//   6. Financial Summary:
//   - currency: Determine the currency used (look for currency symbols like $, ₹, €, or codes like USD, INR, EUR, THB).
//   - subtotal: Extract the total amount before applying taxes and discounts.
//   - tax_details: Extract all applicable taxes as an array of objects, where each object contains:
//   - tax_description or tax_rate: e.g., "GST 18%", "VAT 7%".
//   - tax_amount: The amount of tax applied.
//   - discount_amount: Extract any discount amount applied at the document level.
//   - other_charges: Extract any additional charges mentioned (e.g., shipping, handling, packaging fees, miscellaneous charges).
//   - grand_total: Extract the final payable amount (often labeled as "Total Amount Due", "Grand Total", "Balance Payable", etc.).

//   7. Payment Information:
//   - payment_terms: Extract specific payment instructions or terms (e.g., "Net 30", "Due on Receipt").
//   - bank_details: Extract available banking details provided for payment, including Account Name, Account Number, IFSC Code, SWIFT Code, IBAN, or any other banking-related information.

//   8. Additional Data:
//   - notes: Extract any special instructions, terms & conditions, remarks, or additional comments present anywhere within the document.
//   - attachments: Capture any references to annexures, appendices, or supporting documents mentioned within the invoice.

//   Handling Missing or Unavailable Information:
//   If any specific field cannot be confidently identified or is absent in the document, represent it appropriately in the JSON output using:
//   - null (for scalar values like strings or numbers)
//   - empty string "" (for missing text)
//   - empty array [] (for missing list-type data)

//   Output Instructions:
//   - Output must strictly be in JSON format.
//   - Ensure proper formatting, syntactic correctness, and clean structuring.
//   - Preserve all hierarchical relationships within the data (for example, nesting vendor contact details under vendor_details).
//   - Avoid losing any available data — even if field names vary, your responsibility is to infer their meaning from context and extract them accurately.
//   - Maintain consistent JSON keys across all extracted documents regardless of format variation.
//   - Ensure that all available data is extracted completely and accurately without omissions.

//   Objective:
//   You are a highly specialized, expert-level AI Document Parser. Your sole responsibility is to extract, organize, and transform messy, unstructured, or highly varied invoice documents into structured, clean, and accurate JSON data.

//   Apply advanced contextual understanding, pattern recognition, and semantic analysis to adapt to a wide range of document styles and formats. Prioritize completeness, accuracy, and clarity in your output.

//   Document text:
//   """${documentText}"""

//   ${documentUrl ? `Document URL: ${documentUrl}` : ""}`;

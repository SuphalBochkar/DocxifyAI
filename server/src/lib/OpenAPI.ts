import { OpenAI } from "openai";

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getJSONFormatData(
  documentText: string,
  documentUrl?: string
): Promise<any> {
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

  const prompt = `
  Analyze the URL of the provided Amazon S3 bucket containing the invoice document. Be fully aware that the document's formats, field labels, and layouts may vary greatly from one file to another. Despite these variations, your objective is to extract specific, context-driven information with precision, leveraging both the structure and semantics of the content. Additionally, I will also provide the raw extracted text content of the document to assist in this process.

  Your task is to intelligently extract and structure the following key data points into a well-organized JSON output. Adapt to variations in labels, locations, terminology, or formatting by inferring the correct information based on contextual clues, proximity, and typical placement in invoices.

  Extract the following information:

  1. Document Identification:
  - document_type: Determine and capture the type of document (examples include "Invoice", "Tax Invoice", "Credit Note", "Receipt", etc.).
  - invoice_number: Extract the primary identifier for the document (may appear as "Invoice No.", "Inv #", "Document ID", "Bill No.", etc.).

  2. Issuer/Vendor Information (Details of the entity generating the invoice):
  - vendor_name: Extract the full name of the issuing company or individual.
  - vendor_address: Extract the complete physical address of the vendor.
  - vendor_tax_id: Extract any available tax identification numbers (such as "VAT ID", "GSTIN", "PAN", "Tax ID"). Capture all available if there are multiple.
  - vendor_contact: Extract all available contact details such as phone numbers, email addresses, and website URLs.

  3. Recipient/Customer Information (Details of the entity receiving the invoice):
  - customer_name: Extract the full name of the customer or recipient.
  - customer_address: Extract the complete address of the customer.
  - customer_tax_id: Extract any available tax identifiers for the customer.
  - customer_contact: Extract available customer contact information (phone, email, etc.).
  - customer_account_number: Extract any customer-specific account number or reference code, if mentioned.

  4. Dates:
  - invoice_date: Extract the date the document was issued.
  - due_date: Extract the date by which payment is due (look for labels like "Payment Due", "Due Date", "Payment Terms").
  - service_period: Extract the date range representing the period of service or goods supplied (if available). Look for labels like "Period", "Date Range", "Service Dates".

  5. Line Items / Detailed Breakdown of Products or Services:
  - Instruction: Identify the main table or section that lists the products or services. Extract every row present in this section comprehensively.
  - line_items: This should be an array of objects, where each object corresponds to a row in the line items table. Extract the following (based on the available columns):

  Fields to include within each line item object:
  - description: Extract the description of the product or service.
  - quantity: Extract the quantity or units specified.
  - unit_price: Extract the price per unit.
  - line_total or amount: Extract the total for that line (calculated as quantity multiplied by unit price).
  - Additionally, capture any other relevant fields available within the line item table such as item_code, discount, tax_rate, unit_of_measure, etc.

  6. Financial Summary:
  - currency: Determine the currency used (look for currency symbols like $, ₹, €, or codes like USD, INR, EUR, THB).
  - subtotal: Extract the total amount before applying taxes and discounts.
  - tax_details: Extract all applicable taxes as an array of objects, where each object contains:
  - tax_description or tax_rate: e.g., "GST 18%", "VAT 7%".
  - tax_amount: The amount of tax applied.
  - discount_amount: Extract any discount amount applied at the document level.
  - other_charges: Extract any additional charges mentioned (e.g., shipping, handling, packaging fees, miscellaneous charges).
  - grand_total: Extract the final payable amount (often labeled as "Total Amount Due", "Grand Total", "Balance Payable", etc.).

  7. Payment Information:
  - payment_terms: Extract specific payment instructions or terms (e.g., "Net 30", "Due on Receipt").
  - bank_details: Extract available banking details provided for payment, including Account Name, Account Number, IFSC Code, SWIFT Code, IBAN, or any other banking-related information.

  8. Additional Data:
  - notes: Extract any special instructions, terms & conditions, remarks, or additional comments present anywhere within the document.
  - attachments: Capture any references to annexures, appendices, or supporting documents mentioned within the invoice.

  Handling Missing or Unavailable Information:
  If any specific field cannot be confidently identified or is absent in the document, represent it appropriately in the JSON output using:
  - null (for scalar values like strings or numbers)
  - empty string "" (for missing text)
  - empty array [] (for missing list-type data)

  Output Instructions:
  - Output must strictly be in JSON format.
  - Ensure proper formatting, syntactic correctness, and clean structuring.
  - Preserve all hierarchical relationships within the data (for example, nesting vendor contact details under vendor_details).
  - Avoid losing any available data — even if field names vary, your responsibility is to infer their meaning from context and extract them accurately.
  - Maintain consistent JSON keys across all extracted documents regardless of format variation.
  - Ensure that all available data is extracted completely and accurately without omissions.

  Objective:
  You are a highly specialized, expert-level AI Document Parser. Your sole responsibility is to extract, organize, and transform messy, unstructured, or highly varied invoice documents into structured, clean, and accurate JSON data.

  Apply advanced contextual understanding, pattern recognition, and semantic analysis to adapt to a wide range of document styles and formats. Prioritize completeness, accuracy, and clarity in your output.

  Document text:
  """${documentText}"""

  ${documentUrl ? `Document URL: ${documentUrl}` : ""}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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

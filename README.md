# DocxifyAI

An AI-powered document understanding system that automates the extraction, validation, and structuring of data from business documents like invoices, receipts, and purchase orders.

## Overview

**DocxifyAI** intelligently processes uploaded documents to extract structured data using OCR, AWS Textract, and AI-based JSON transformation. It ensures data completeness, predicts missing fields, and delivers clean, ready-to-use outputs for enterprise workflows.

### Key Highlights

- 📄 Multi-format document upload (PDF, JPG, PNG)
- 🧠 AI-driven structured JSON generation
- ☁️ AWS Textract + Tesseract fallback OCR
- ⚙️ Bull (Redis) queue system for scalable background jobs
- 🧾 Intelligent handling of grouped data (line items, tables)
- 🔍 Automated missing data inference and validation
- 🗂️ Prisma + MongoDB for robust schema management
- 🚀 Modern TypeScript + Express backend architecture
- 🧰 Frontend built with Next.js + Tailwind for smooth interaction

---

## Tech Stack

| Layer                 | Technology                                      |
| --------------------- | ----------------------------------------------- |
| **Frontend**          | Next.js 14, TypeScript, Tailwind CSS, ShadCN UI |
| **Backend**           | Express.js (TypeScript)                         |
| **Database**          | MongoDB + Prisma ORM                            |
| **AI/ML Integration** | OpenAI API                                      |
| **Cloud Services**    | AWS Textract, AWS S3                            |
| **Job Queues**        | Bull + Redis                                    |
| **OCR Fallbacks**     | Tesseract.js, PDF.js                            |
| **Deployment**        | Vercel (client) + Vercel (server)               |

---

## System Architecture

### 1. Extraction Stage

- Uploaded documents are stored securely on AWS S3.
- AWS Textract extracts text; fallback to **Tesseract.js** or **PDF.js** if Textract fails.
- Raw text is preprocessed and cleaned using regex and text-normalization utilities.

### 2. Processing Stage

- Extracted text is passed to the AI model via OpenAI API.
- AI parses document structure, validates data, and outputs structured JSON.
- Missing or uncertain values are intelligently predicted or flagged for review.

---

## Core Features

### 🧾 Document Handling

- Secure uploads via REST endpoints (`/docs`)
- Support for multiple file types and concurrent uploads

### 🤖 AI Data Structuring

- Context-aware JSON mapping using prompt-engineered instructions
- Auto-detection of key-value pairs and tabular data
- Schema validation for extracted results

### ⚡ Scalable Architecture

- Redis queue-based background processing
- Parallel job execution for batch uploads
- Separate workers for extraction and AI processing

### 🧩 Error Handling & Monitoring

- Automatic retries for failed jobs
- Prisma-based document status tracking
- Detailed logging for each processing stage

### 🖥️ Frontend Features

- Clean dashboard for document uploads and chat-based review
- Real-time progress display using API status
- Built with **Next.js App Router**, **ShadCN UI**, and **Tailwind**

---

## Project Structure

```
DocxifyAI/
├── client/           # Next.js frontend
│   ├── src/
│   │   ├── app/              # App Router pages (Home, Upload, Agent)
│   │   ├── components/       # Modular UI and functional components
│   │   ├── hooks/            # Reusable frontend hooks
│   │   ├── lib/              # Utilities & type definitions
│   │   └── providers/        # Theme & global context providers
│   └── public/               # Assets and icons
│
├── server/           # Express.js + TypeScript backend
│   ├── src/
│   │   ├── handlers/         # Core logic for extraction & processing
│   │   ├── routes/           # REST routes (docs, ops, chat, records)
│   │   ├── lib/              # AWS, Prisma, queues, prompts, etc.
│   │   ├── services/         # PDF/OCR services & thread management
│   │   └── prisma/           # Schema & migrations
│
├── doc/              # Documentation & prompt design
└── README.md
```

---

## License

This project is licensed under the Apache License 2.0 — see the [LICENSE](LICENSE) file for details.
© 2025 Suphal Bochkar. All rights reserved.

---

## Support

For support, contact [suphalbochkar@gmail.com](mailto:suphalbochkar@gmail.com)
or open an issue on the repository.

// import { useState } from 'react';
// import { DocumentViewer } from '../components/DocumentViewer';
// import { ChatInterface } from '../components/ChatInterface';
// import { Document, ChatMessage, ParsedField } from '../types';

// const SAMPLE_FIELDS: ParsedField[] = [
//   { name: 'Invoice Number', value: 'INV-2024-001', status: 'found' },
//   { name: 'Due Date', value: null, status: 'missing' },
//   { name: 'Total Amount', value: '$1,234.56', status: 'found' },
//   { name: 'Vendor Name', value: null, status: 'missing' },
// ];

// export function Agent() {
//   const [messages, setMessages] = useState<ChatMessage[]>([
//     {
//       id: '1',
//       role: 'assistant',
//       content: 'Hello! I can help you find missing information in your documents. What would you like to know?',
//       timestamp: new Date().toISOString(),
//     },
//   ]);

//   const handleSendMessage = (content: string) => {
//     const newMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: 'user',
//       content,
//       timestamp: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, newMessage]);

//     // Simulate AI response
//     setTimeout(() => {
//       const response: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: 'assistant',
//         content: 'I found the missing information you requested...',
//         timestamp: new Date().toISOString(),
//       };
//       setMessages((prev) => [...prev, response]);
//     }, 1000);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <DocumentViewer parsedFields={SAMPLE_FIELDS} />
//         <ChatInterface
//           messages={messages}
//           onSendMessage={handleSendMessage}
//         />
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { DocumentViewer } from "../components/DocumentViewer";
import { ChatInterface } from "../components/ChatInterface";
import { ChatMessage, ParsedField } from "../lib/types";

export function Agent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I can help you find missing information in your documents. What would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const [parsedFields, setParsedFields] = useState<ParsedField[]>([]); // Store API data

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/documents"); // Adjust API endpoint
        const data = await response.json();
        setParsedFields(data.fields); // Assuming API returns { fields: [...] }
      } catch (error) {
        console.error("Error fetching document data:", error);
      }
    };

    fetchData();
  }, []); // Runs once when component mounts

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Simulate AI response
    setTimeout(() => {
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I found the missing information you requested...",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DocumentViewer parsedFields={parsedFields} />
        <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

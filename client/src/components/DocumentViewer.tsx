

// // // // import { Check, X } from "lucide-react";
// // // // import { DocumentViewerProps } from "../lib/types";

// // // // export function DocumentViewer({
// // // //   document,
// // // //   parsedFields = [],
// // // // }: DocumentViewerProps) {
// // // //   return (
// // // //     <div className="bg-white rounded-lg shadow-lg p-6">
// // // //       <h2 className="text-2xl font-bold mb-6">Document Analysis</h2>

// // // //       <div className="space-y-6">
// // // //         {parsedFields?.map((field) => (
// // // //           <div key={field.name} className="flex items-start space-x-3">
// // // //             {field.status === "found" ? (
// // // //               <Check className="h-5 w-5 text-green-500 mt-1" />
// // // //             ) : (
// // // //               <X className="h-5 w-5 text-red-500 mt-1" />
// // // //             )}
// // // //             <div>
// // // //               <h3 className="font-medium text-gray-900">{field.name}</h3>
// // // //               {field.value ? (
// // // //                 <p className="text-gray-600">{field.value}</p>
// // // //               ) : (
// // // //                 <p className="text-red-500">Missing</p>
// // // //               )}
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //       </div>

// // // //       {document?.content && (
// // // //         <div className="mt-8">
// // // //           <h3 className="font-medium text-gray-900 mb-2">Document Preview</h3>
// // // //           <div className="bg-gray-100 p-4 rounded-md">
// // // //             <pre className="whitespace-pre-wrap text-sm text-gray-600">
// // // //               {document.content}
// // // //             </pre>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }



// // // import { useState } from "react";
// // // import { Check, X } from "lucide-react";
// // // import { DocumentViewerProps } from "../lib/types";
// // // import { Button } from "@/components/ui/button";

// // // export function DocumentViewer({ document, parsedFields = [] }: DocumentViewerProps) {
// // //   const [viewMode, setViewMode] = useState("structured");

// // //   const missingFields = parsedFields
// // //     .filter((field) => field.status !== "found")
// // //     .map((field) => ({ name: field.name, value: field.value || "Missing" }));

// // //   return (
// // //     <div className="bg-gray-900 text-white p-4 rounded-lg shadow-lg">
// // //       <div className="flex justify-between items-center mb-4 border-b pb-2">
// // //         <h2 className="text-xl font-bold">Document Analysis</h2>
// // //         <button
// // //           className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
// // //           onClick={() => setViewMode(viewMode === "structured" ? "json" : "structured")}
// // //         >
// // //           {viewMode === "structured" ? "JSON View" : "Table View"}
// // //         </button>
// // //       </div>
      
// // //       <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg">
// // //         <div className="border-r pr-4">
// // //           {viewMode === "structured" ? (
// // //             <div className="space-y-4">
// // //               {parsedFields?.map((field) => (
// // //                 <div key={field.name} className="flex items-start space-x-3">
// // //                   {field.status === "found" ? (
// // //                     <Check className="h-5 w-5 text-green-500 mt-1" />
// // //                   ) : (
// // //                     <X className="h-5 w-5 text-red-500 mt-1" />
// // //                   )}
// // //                   <div>
// // //                     <h3 className="font-medium">{field.name}</h3>
// // //                     {field.value ? (
// // //                       <p className="text-gray-300">{field.value}</p>
// // //                     ) : (
// // //                       <p className="text-red-400">Missing</p>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           ) : (
// // //             <div className="bg-gray-800 p-4 rounded-md">
// // //               <h3 className="font-medium mb-2">Missing Fields (JSON)</h3>
// // //               <pre className="whitespace-pre-wrap text-sm text-gray-300">{JSON.stringify(missingFields, null, 2)}</pre>
// // //             </div>
// // //           )}
// // //         </div>
// // //         <div className="bg-gray-800 p-4 rounded-md">
// // //           <h3 className="font-medium mb-2">PDF Preview</h3>
// // //           <div className="h-64 bg-gray-700 flex items-center justify-center text-gray-400">
// // //             PDF Viewer Placeholder
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <div className="mt-6 grid grid-cols-2 gap-4">
// // //         <div>
// // //           <h3 className="font-medium mb-2">Select Document</h3>
// // //           <div className="bg-gray-800 p-2 rounded-md space-y-2">
// // //             {[...Array(4)].map((_, i) => (
// // //               <div key={i} className="flex justify-between items-center bg-gray-700 p-2 rounded-md">
// // //                 <span className="text-sm">My_doc_{i + 1}.pdf (5.3MB)</span>
// // //                 <button className="bg-red-600 text-white px-2 py-1 text-xs rounded-md">Delete</button>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </div>
// // //         <div>
// // //           <h3 className="font-medium mb-2">Agent</h3>
// // //           <div className="bg-gray-800 p-4 rounded-md space-y-2">
// // //             <input type="text" placeholder="Enter message" className="w-full p-2 bg-gray-700 rounded-md text-white" />
// // //             <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700">Chat With Agent</button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // import { useState } from "react";
// // // import { Check, X } from "lucide-react";
// // // import { DocumentViewerProps } from "../lib/types";
// // // // import { Button } from "@/components/ui/button";

// // // export function DocumentViewer({
// // //   document,
// // //   parsedFields = [],
// // // }: DocumentViewerProps) {
// // //   const [view, setView] = useState("default");

// // //   const missingData = parsedFields
// // //     .filter((field) => field.status !== "found" || !field.value)
// // //     .map((field) => ({ name: field.name, value: field.value || "Missing" }));

// // //   return (
// // //     <div className="bg-white rounded-lg shadow-lg p-6">
// // //       <div className="flex justify-between items-center mb-6">
// // //         <h2 className="text-2xl font-bold">Document Analysis</h2>
// // //         <button onClick={() => setView(view === "default" ? "json" : "default")}>
// // //           {view === "default" ? "Show JSON View" : "Show Standard View"}
// // //         </button>
// // //       </div>

// // //       {view === "default" ? (
// // //         <div className="space-y-6">
// // //           {parsedFields?.map((field) => (
// // //             <div key={field.name} className="flex items-start space-x-3">
// // //               {field.status === "found" ? (
// // //                 <Check className="h-5 w-5 text-green-500 mt-1" />
// // //               ) : (
// // //                 <X className="h-5 w-5 text-red-500 mt-1" />
// // //               )}
// // //               <div>
// // //                 <h3 className="font-medium text-gray-900">{field.name}</h3>
// // //                 {field.value ? (
// // //                   <p className="text-gray-600">{field.value}</p>
// // //                 ) : (
// // //                   <p className="text-red-500">Missing</p>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       ) : (
// // //         <div className="bg-gray-100 p-4 rounded-md">
// // //           <h3 className="font-medium text-gray-900 mb-2">Missing Data (JSON View)</h3>
// // //           <pre className="whitespace-pre-wrap text-sm text-gray-600">
// // //             {JSON.stringify(missingData, null, 2)}
// // //           </pre>
// // //         </div>
// // //       )}

// // //       {document?.content && (
// // //         <div className="mt-8">
// // //           <h3 className="font-medium text-gray-900 mb-2">Document Preview</h3>
// // //           <div className="bg-gray-100 p-4 rounded-md">
// // //             <pre className="whitespace-pre-wrap text-sm text-gray-600">
// // //               {document.content}
// // //             </pre>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }


// // import { useState } from "react";
// // import { Check, X } from "lucide-react";
// // import { DocumentViewerProps } from "../lib/types";
// // // import { Button } from "@/components/ui/button";

// // export function DocumentViewer({
// //   document,
// //   parsedFields = [],
// // }: DocumentViewerProps) {
// //   const [view, setView] = useState("default");

// //   const missingData = parsedFields
// //     .filter((field) => field.status !== "found" || !field.value)
// //     .map((field) => ({ name: field.name, value: field.value || "Missing" }));

// //   return (
// //     <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
// //       <div className="flex justify-between items-center mb-6 border-b pb-3">
// //         <h2 className="text-2xl font-bold text-gray-900">Document Analysis</h2>
// //         <button  onClick={() => setView(view === "default" ? "json" : "default")}> 
// //           {view === "default" ? "Show JSON View" : "Show Standard View"}
// //         </button>
// //       </div>

// //       {view === "default" ? (
// //         <div className="space-y-6">
// //           {parsedFields?.map((field) => (
// //             <div key={field.name} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
// //               {field.status === "found" ? (
// //                 <Check className="h-5 w-5 text-green-500 mt-1" />
// //               ) : (
// //                 <X className="h-5 w-5 text-red-500 mt-1" />
// //               )}
// //               <div>
// //                 <h3 className="font-medium text-gray-900">{field.name}</h3>
// //                 {field.value ? (
// //                   <p className="text-gray-600">{field.value}</p>
// //                 ) : (
// //                   <p className="text-red-500">Missing</p>
// //                 )}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       ) : (
// //         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
// //           <h3 className="font-medium text-gray-900 mb-2">Missing Data (JSON View)</h3>
// //           <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
// //             {JSON.stringify(missingData, null, 2)}
// //           </pre>
// //         </div>
// //       )}

// //       {document?.content && (
// //         <div className="mt-8">
// //           <h3 className="font-medium text-gray-900 mb-2">Document Preview</h3>
// //           <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
// //             <pre className="whitespace-pre-wrap text-sm text-gray-700">
// //               {document.content}
// //             </pre>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import { Check, X } from "lucide-react";
// import { DocumentViewerProps } from "../lib/types";
// // import { Button } from "@/components/ui/button";

// export function DocumentViewer({
//   document,
//   parsedFields = [],
// }: DocumentViewerProps) {
//   const [view, setView] = useState("default");

//   const missingData = parsedFields
//     .filter((field) => field.status !== "found" || !field.value)
//     .map((field) => ({ name: field.name, value: field.value || "Missing" }));

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//       <div className="flex justify-between items-center mb-6 border-b pb-3">
//         <h2 className="text-2xl font-bold text-gray-900">Document Analysis</h2>
//         <button  onClick={() => setView(view === "default" ? "json" : "default")}> 
//           {view === "default" ? "Show JSON View" : "Show Structured View"}
//         </button>
//       </div>

//       <h2 className="text-xl font-bold text-gray-900 mb-4">
//         {view === "default" ? "Structured View" : "JSON View"}
//       </h2>

//       {view === "default" ? (
//         <div className="space-y-6">
//           {parsedFields?.map((field) => (
//             <div key={field.name} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
//               {field.status === "found" ? (
//                 <Check className="h-5 w-5 text-green-500 mt-1" />
//               ) : (
//                 <X className="h-5 w-5 text-red-500 mt-1" />
//               )}
//               <div>
//                 <h3 className="font-medium text-gray-900">{field.name}</h3>
//                 {field.value ? (
//                   <p className="text-gray-600">{field.value}</p>
//                 ) : (
//                   <p className="text-red-500">Missing</p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//           <h3 className="font-medium text-gray-900 mb-2">Missing Data (JSON View)</h3>
//           <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
//             {JSON.stringify(missingData, null, 2)}
//           </pre>
//         </div>
//       )}

//       {document?.content && (
//         <div className="mt-8">
//           <h3 className="font-medium text-gray-900 mb-2">Document Preview</h3>
//           <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
//             <pre className="whitespace-pre-wrap text-sm text-gray-700">
//               {document.content}
//             </pre>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { useState } from "react";
import { Check, X } from "lucide-react";
import { DocumentViewerProps } from "../lib/types";
// import { Button } from "@/components/ui/button"b

export function DocumentViewer({
  document,
  parsedFields = [],
}: DocumentViewerProps) {
  const [view, setView] = useState("default");

  const missingData = parsedFields
    .filter((field) => field.status !== "found" || !field.value)
    .map((field) => ({ name: field.name, value: field.value || "Missing" }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-2xl font-bold text-gray-900">Document Analysis</h2>
        <button 
          
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition" 
          onClick={() => setView(view === "default" ? "json" : "default")}
        > 
          {view === "default" ? "Show JSON View" : "Show Structured View"}
        </button>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {view === "default" ? "Structured View" : "JSON View"}
      </h2>

      {view === "default" ? (
        <div className="space-y-6">
          {parsedFields?.map((field) => (
            <div key={field.name} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              {field.status === "found" ? (
                <Check className="h-5 w-5 text-green-500 mt-1" />
              ) : (
                <X className="h-5 w-5 text-red-500 mt-1" />
              )}
              <div>
                <h3 className="font-medium text-gray-900">{field.name}</h3>
                {field.value ? (
                  <p className="text-gray-600">{field.value}</p>
                ) : (
                  <p className="text-red-500">Missing</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Missing Data (JSON View)</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-100 p-3 rounded-lg">
            {JSON.stringify(missingData, null, 2)}
          </pre>
        </div>
      )}

      {document?.content && (
        <div className="mt-8">
          <h3 className="font-medium text-gray-900 mb-2">Document Preview</h3>
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {document.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}


// import { Check, X } from "lucide-react";
// import { DocumentViewerProps } from "../lib/types";

// export function DocumentViewer({
//   document,
//   parsedFields = [],
// }: DocumentViewerProps) {
//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6">
//       <h2 className="text-2xl font-bold mb-6">Document Analysis</h2>

//       <div className="space-y-6">
//         {parsedFields?.map((field) => (
//           <div key={field.name} className="flex items-start space-x-3">
//             {field.status === "found" ? (
//               <Check className="h-5 w-5 text-green-500 mt-1" />
//             ) : (
//               <X className="h-5 w-5 text-red-500 mt-1" />
//             )}
//             <div>
//               <h3 className="font-medium text-gray-900">{field.name}</h3>
//               {field.value ? (
//                 <p className="text-gray-600">{field.value}</p>
//               ) : (
//                 <p className="text-red-500">Missing</p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {document?.content && (
//         <div className="mt-8">
//           <h3 className="font-medium text-gray-900 mb-2">Document Preview</h3>
//           <div className="bg-gray-100 p-4 rounded-md">
//             <pre className="whitespace-pre-wrap text-sm text-gray-600">
//               {document.content}
//             </pre>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


import { Check, X } from "lucide-react";
import { DocumentViewerProps } from "../lib/types";
// import {ChatInterface} from "./ChatInterface";

export function DocumentViewer({
  document,
  parsedFields = [],
}: DocumentViewerProps) {
  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-3 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Document Analysis</h2>
        
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Structured View</h3>
          <div className="space-y-3">
            {parsedFields?.map((field) => (
              <div 
                key={field.name} 
                className={`flex items-center space-x-3 p-2 rounded border ${
                  field.status === "found" 
                    ? "border-green-200 bg-green-50" 
                    : "border-red-200 bg-red-50"
                }`}
              >
                {field.status === "found" ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
                <span className={field.status === "found" ? "text-gray-900" : "text-red-500"}>
                  {field.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">JSON View</h3>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(parsedFields, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      
      <div className="col-span-2 space-y-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Document Preview</h2>
          {document?.content ? (
            <div className="bg-gray-50 p-4 rounded border border-gray-200 min-h-[300px]">
              <pre className="whitespace-pre-wrap text-sm text-gray-600">
                {document.content}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded border border-gray-200">
              <p className="text-gray-400">No document loaded</p>
            </div>
          )}
        </div>
        {/* <ChatInterface/> */}
      </div>
    </div>
  );
}


export default DocumentViewer;
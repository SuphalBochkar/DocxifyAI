// import { Check, X } from 'lucide-react';
// import { DocumentViewerProps, ParsedField } from '../types';

// export function DocumentViewer({ document, parsedFields }: DocumentViewerProps) {
//   return (
//     <div className="bg-white rounded-lg shadow-lg p-6">
//       <h2 className="text-2xl font-bold mb-6">Document Analysis</h2>

//       <div className="space-y-6">
//         {parsedFields.map((field) => (
//           <div key={field.name} className="flex items-start space-x-3">
//             {field.status === 'found' ? (
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

//       {document && (
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

export function DocumentViewer({
  document,
  parsedFields = [],
}: DocumentViewerProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Document Analysis</h2>

      <div className="space-y-6">
        {parsedFields?.map((field) => (
          <div key={field.name} className="flex items-start space-x-3">
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

      {document?.content && (
        <div className="mt-8">
          <h3 className="font-medium text-gray-900 mb-2">Document Preview</h3>
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="whitespace-pre-wrap text-sm text-gray-600">
              {document.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

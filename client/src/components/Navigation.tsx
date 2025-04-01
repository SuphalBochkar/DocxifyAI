import { FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold">Docxify</span>
            </Link>

            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/"
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Home
              </Link>

              <Link
                to="/agent"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === "/agent"
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                Agent
              </Link>
            </div>
          </div>

          <Link
            to="/upload"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Upload Document
          </Link>
        </div>
      </div>
    </nav>
  );
}

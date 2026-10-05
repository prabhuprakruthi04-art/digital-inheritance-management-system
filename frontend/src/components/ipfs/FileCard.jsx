import { useState } from "react";
import DocumentPreview from "./DocumentPreview";

export default function FileCard({ document, onDelete }) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-semibold truncate">
              {document.name}
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {document.mimeType || "Unknown file type"}
            </p>

            {document.createdAt && (
              <p className="text-xs text-gray-400 mt-2">
                Uploaded{" "}
                {new Date(
                  document.createdAt
                ).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            View
          </button>

          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
          >
            Open
          </a>

          {onDelete && (
            <button
              onClick={() => onDelete(document._id)}
              className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {showPreview && (
        <DocumentPreview
          document={document}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
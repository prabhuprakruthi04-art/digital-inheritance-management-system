import { useState } from "react";

export default function DocumentPreview({ document, onClose }) {
  const [loading, setLoading] = useState(true);

  if (!document) {
    return null;
  }

  const isPdf =
    document.mimeType === "application/pdf" ||
    document.type === "application/pdf";

  const isImage =
    document.mimeType?.startsWith("image/") ||
    document.type?.startsWith("image/");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-5">
      <div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="font-semibold text-lg">
              {document.name}
            </h2>

            <p className="text-sm text-gray-500">
              Document Preview
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-auto flex items-center justify-center p-4">
          {loading && (
            <p className="text-gray-500">
              Loading preview...
            </p>
          )}

          {isPdf && (
            <iframe
              src={document.url}
              title={document.name}
              className="w-full h-full rounded-lg"
              onLoad={() => setLoading(false)}
            />
          )}

          {isImage && (
            <img
              src={document.url}
              alt={document.name}
              className="max-w-full max-h-full object-contain"
              onLoad={() => setLoading(false)}
            />
          )}

          {!isPdf && !isImage && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Preview is not available for this file type.
              </p>

              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg"
              >
                Open Document
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";

import FileUploader from "../components/ipfs/FileUploader";
import UploadProgress from "../components/ipfs/UploadProgress";
import DocumentList from "../components/ipfs/DocumentList";

import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../services/ipfsApi";

export default function Documents() {
  const { assetId } = useParams();

  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDocuments(assetId || null);

      setDocuments(response.documents || response || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load documents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [assetId]);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a document first.");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      setMessage("");
      setError("");

      const formData = new FormData();
      formData.append("document", file);
      if (assetId) {
        formData.append("assetId", assetId);
      }

      const response = await uploadDocument(
        formData,
        (event) => {
          if (event.total) {
            const percentage = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percentage);
          }
        }
      );

      setMessage(
        response.message ||
          "Document uploaded successfully."
      );

      setFile(null);
      setProgress(0);

      await loadDocuments();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Document upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteDocument(documentId);

      setDocuments((currentDocuments) =>
        currentDocuments.filter(
          (document) => document._id !== documentId
        )
      );

      setMessage("Document deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete document."
      );
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Digital Documents
          </h1>

          <p className="mt-2 text-gray-500">
            Securely manage documents associated with your digital inheritance assets.
          </p>
        </div>

        {!assetId && (
          <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-indigo-800">
            Showing all uploaded documents. Select a specific asset to filter documents by asset.
          </div>
        )}

        <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Upload Document
          </h2>

          <FileUploader onUpload={setFile} />

          {file && (
            <div className="mt-5 rounded-lg bg-gray-50 p-4">
              <p className="font-medium text-gray-900">
                Selected file
              </p>

              <p className="mt-1 text-sm text-gray-600">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className="mt-4 rounded-lg bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading
                  ? "Uploading to IPFS..."
                  : "Upload Document"}
              </button>

              {uploading && (
                <div className="mt-4">
                  <UploadProgress
                    progress={progress}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {message && (
          <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-gray-900">
            Your Documents
          </h2>

          <DocumentList
            documents={documents}
            loading={loading}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </AppLayout>
  );
}
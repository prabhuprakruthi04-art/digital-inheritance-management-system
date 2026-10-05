import api from "./api";

export const uploadDocument = async (formData, onUploadProgress) => {
  const response = await api.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return response.data;
};

export const getDocuments = async (assetId) => {
  // If assetId is provided, fetch asset-specific documents; otherwise fetch all
  const url = assetId ? `/documents/${assetId}` : "/documents";
  const response = await api.get(url);
  return response.data;
};

export const deleteDocument = async (documentId) => {
  const response = await api.delete(`/documents/${documentId}`);
  return response.data;
};
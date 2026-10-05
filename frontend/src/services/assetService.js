import API from "./api";

/* Get all assets (documents) */
export const getAssets = async () => {
  const response = await API.get("/documents");
  return response.data;
};

/* Get one asset (document) */
export const getAssetById = async (id) => {
  const response = await API.get(`/documents/${id}`);
  return response.data;
};

/* Create Asset (upload encrypted file & create metadata) */
export const createAsset = async (formData) => {
  const response = await API.post("/documents/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/* Update Asset */
export const updateAsset = async (id, formData) => {
  const response = await API.put(`/documents/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/* Delete Asset */
export const deleteAsset = async (id) => {
  const response = await API.delete(`/documents/${id}`);
  return response.data;
};
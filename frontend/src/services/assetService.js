import API from "./api";

/* Get all assets (documents + assets merged) */
export const getAssets = async () => {
  try {
    const response = await API.get("/assets");
    if (response?.data && (Array.isArray(response.data) ? response.data.length > 0 : response.data.data?.length > 0)) {
      return response.data;
    }
  } catch (err) {
    // fallback to documents endpoint
  }
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

/* Delete Asset (deletes across both documents and assets collections) */
export const deleteAsset = async (id) => {
  await Promise.all([
    API.delete(`/documents/${id}`).catch(() => {}),
    API.delete(`/assets/${id}`).catch(() => {}),
  ]);
  return { success: true };
};
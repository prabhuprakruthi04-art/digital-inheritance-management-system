import api from "./api";

// Enroll Face
export const enrollFace = async (formData) => {
  try {
    const response = await api.post("/biometrics/enroll-face", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const fallbackResponse = await api.post("/face/enroll", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return fallbackResponse.data;
    }
    throw err;
  }
};

// Verify Face
export const verifyFace = async (formData) => {
  try {
    const response = await api.post("/biometrics/verify-face", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const fallbackResponse = await api.post("/face/verify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return fallbackResponse.data;
    }
    throw err;
  }
};

// Check Status
export const getFaceStatus = async () => {
  try {
    const response = await api.get("/biometrics/status");
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const fallbackResponse = await api.get("/face/status");
      return fallbackResponse.data;
    }
    throw err;
  }
};

// Delete Face
export const removeFace = async () => {
  try {
    const response = await api.delete("/biometrics/remove");
    return response.data;
  } catch (err) {
    if (err.response?.status === 404) {
      const fallbackResponse = await api.delete("/face/remove");
      return fallbackResponse.data;
    }
    throw err;
  }
};
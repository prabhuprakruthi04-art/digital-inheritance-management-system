import api from "./api";

export const getClaims = async () => {
  const response = await api.get("/claims");

  return response.data;
};

export const getClaim = async (claimId) => {
  const response = await api.get(`/claims/${claimId}`);

  return response.data;
};

export const createClaim = async (assetId) => {
  const response = await api.post(
    `/claims/${assetId}`
  );

  return response.data;
};

export const submitClaim = async (claimId) => {
  const response = await api.post(
    `/claims/${claimId}/submit`
  );

  return response.data;
};

export const cancelClaim = async (claimId) => {
  const response = await api.post(
    `/claims/${claimId}/cancel`
  );

  return response.data;
};
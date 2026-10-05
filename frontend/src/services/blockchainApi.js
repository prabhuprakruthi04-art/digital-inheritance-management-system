import api from "./api";

export const getBlockchainStatus = async () => {
  const response = await api.get("/blockchain/status");

  return response.data;
};

export const getTransactions = async () => {
  const response = await api.get("/blockchain/transactions");

  return response.data;
};

export const getTransaction = async (transactionId) => {
  const response = await api.get(
    `/blockchain/transactions/${transactionId}`
  );

  return response.data;
};
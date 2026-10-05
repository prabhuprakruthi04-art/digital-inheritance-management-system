import API from "./api";

// Get all nominees
export const getNominees = async () => {
  const response = await API.get("/nominees");
  return response.data;
};

// Get nominee by ID
export const getNomineeById = async (id) => {
  const response = await API.get(`/nominees/${id}`);
  return response.data;
};

// Create nominee
export const createNominee = async (data) => {
  const response = await API.post("/nominees", data);
  return response.data;
};

// Update nominee
export const updateNominee = async (id, data) => {
  const response = await API.put(`/nominees/${id}`, data);
  return response.data;
};

// Delete nominee
export const deleteNominee = async (id) => {
  const response = await API.delete(`/nominees/${id}`);
  return response.data;
};
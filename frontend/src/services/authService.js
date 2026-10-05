export const register = async (userData) => {
  const response = await axios.post(
    "/api/auth/register",
    userData
  );

  return response.data;
};
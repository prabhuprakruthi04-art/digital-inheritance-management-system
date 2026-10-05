import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (!token || !savedUser) {
          setUser(null);
          return;
        }

        const parsedUser = JSON.parse(savedUser);

        if (!parsedUser || typeof parsedUser !== "object") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          return;
        }

        // Ensure user object has normalized role and id fields
        const normalizedUser = {
          ...parsedUser,
          _id: parsedUser.id || parsedUser._id,
          role: (parsedUser.role || "owner").toLowerCase(),
        };

        setUser(normalizedUser);
      } catch (error) {
        console.error("Failed to restore authentication:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await API.post("/auth/login", { email, password });

    const token = response.data?.token || response.data?.data?.token;
    const rawUser =
      response.data?.user ||
      response.data?.data?.user ||
      response.data?.data;

    if (!token || !rawUser) {
      throw new Error(
        response.data?.message || "Invalid authentication response from server."
      );
    }

    // Explicitly preserve role and normalize ID
    const authenticatedUser = {
      ...rawUser,
      _id: rawUser.id || rawUser._id,
      role: (rawUser.role || "owner").toLowerCase(),
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(authenticatedUser));

    setUser(authenticatedUser);

    return authenticatedUser;
  };

  const register = async (data) => {
    const response = await API.post("/auth/register", data);

    const token = response.data?.token || response.data?.data?.token;
    const rawUser =
      response.data?.user ||
      response.data?.data?.user ||
      response.data?.data;

    if (token && rawUser) {
      const registeredUser = {
        ...rawUser,
        _id: rawUser.id || rawUser._id,
        role: (rawUser.role || data.role || "owner").toLowerCase(),
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(registeredUser));
      setUser(registeredUser);
    }

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
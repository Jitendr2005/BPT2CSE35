import { createContext, useContext, useEffect, useState } from "react";
import client from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("spas_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await client.get("/auth/me");
        setUser(response.data.user);
      } catch (_error) {
        localStorage.removeItem("spas_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (payload, mode) => {
    const response = await client.post(`/auth/${mode}`, payload);
    localStorage.setItem("spas_token", response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = () => {
    localStorage.removeItem("spas_token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

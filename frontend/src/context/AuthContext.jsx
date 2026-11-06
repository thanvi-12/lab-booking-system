
import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user") || "null");
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        const currentUser = response.data.data;

        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();

    const handleExpired = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener("auth-expired", handleExpired);

    return () => {
      window.removeEventListener("auth-expired", handleExpired);
    };
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password
    });

    const { token, user } = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  const register = async (name, email, password) => {
    return await api.post("/auth/register", {
      name,
      email,
      password
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

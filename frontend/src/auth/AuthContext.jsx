import {
  createContext,
  useEffect,
  useState,
} from "react";

import api from "../api/axios";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem("access_token"))
  );

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const {
      access_token,
      role,
      user_id,
      customer_id,
    } = response.data;

    localStorage.setItem(
      "access_token",
      access_token
    );

    setUser({
      id: user_id,
      email,
      role,
      customer_id,
      is_active: true,
    });

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "ADMIN",
        isCustomer: user?.role === "CUSTOMER",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
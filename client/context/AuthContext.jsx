import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  // À l'initialisation, si on a un token, on le met dans les headers Axios
  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    }
  }, [user]);

  // vérifie si l'utilisateur est authentifié
  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true } // envoi des cookies si nécessaire
      );
      const { token, user: userData } = res.data;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const stored = { ...userData, token };
      localStorage.setItem("user", JSON.stringify(stored));
      setUser(stored);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Échec du login :", err);
      // gestion spécifique du rate-limit (429)
      // si le serveur renvoie une erreur 429, on afficher un message spécifique
      if (err.response?.status === 429) {
        throw new Error(
          "Trop de tentatives. Merci de patienter avant de réessayer."
        );
      }
      throw err;
    }
  };

  const register = async (email, password, pseudo) => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          email,
          password,
          pseudo,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Échec de l'inscription :", err);
      throw err;
    }
  };

  const logout = () => {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

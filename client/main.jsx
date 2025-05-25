import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import axios from "axios";

// Récupère le token depuis le localStorage et l'ajoute aux headers Axios
const stored = localStorage.getItem("user");
if (stored) {
  const { token } = JSON.parse(stored);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Récupère l'URL de l'API depuis le fichier .env
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

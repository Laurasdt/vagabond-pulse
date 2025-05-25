import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/pages/Login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      console.error("Échec du login :", err);
      // Gestion du message custom du rate-limit
      if (
        err.message ===
        "Trop de tentatives. Merci de patienter avant de réessayer."
      ) {
        alert(err.message);
      }
      // Gestion spécifique du status HTTP 429 (cache rare)
      else if (err.response?.status === 429) {
        alert("Trop de tentatives. Merci de patienter avant de réessayer.");
      }
      // Gestion des erreurs réseau
      else if (
        err.code === "ERR_NETWORK" ||
        err.code === "ERR_CONNECTION_REFUSED" ||
        err.message === "Network Error"
      ) {
        alert("Impossible de contacter le serveur. Vérifiez votre connexion.");
      }
      // Gestion des mauvaises requêtes (credentials invalides)
      else if (err.response?.status === 400) {
        alert(
          err.response?.data?.message || "E-mail ou mot de passe incorrect."
        );
      } else if (
        err.code === "ERR_NETWORK" ||
        err.code === "ERR_CONNECTION_REFUSED" ||
        err.message === "Network Error"
      ) {
        alert("Impossible de contacter le serveur. Vérifiez votre connexion.");
      } else {
        alert(err.response?.data?.error || "Erreur lors de la connexion");
      }
    }
  };

  return (
    <main className="login-page">
      <h1>Connexion</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn">
          Se connecter
        </button>
      </form>

      <p className="login-footer">
        Pas encore de compte ?{" "}
        <Link to="/register" className="signup-link">
          Créer un compte
        </Link>
      </p>
    </main>
  );
};

export default Login;

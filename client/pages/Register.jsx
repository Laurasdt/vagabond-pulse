import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Register.scss";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    pseudo: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePseudo = (pseudo) => /^[A-Za-z0-9]{5,20}$/.test(pseudo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation du pseudo
    if (!validatePseudo(formData.pseudo)) {
      setError(
        "Le pseudo doit faire entre 5 et 20 caractères alphanumériques, sans espaces ni caractères spéciaux."
      );
      return;
    }

    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // Appel vers la bonne route d'inscription
      await axios.post("http://localhost:5000/api/auth/register", {
        email: formData.email,
        pseudo: formData.pseudo,
        password: formData.password,
      });
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <main className="register-page">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit} className="register-form">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="pseudo">Pseudo</label>
        <input
          id="pseudo"
          type="text"
          name="pseudo"
          value={formData.pseudo}
          onChange={handleChange}
          required
          minLength={5}
          maxLength={20}
          pattern="^[A-Za-z0-9]{5,20}$"
          title="5 à 20 caractères alphanumériques, sans espaces ni caractères spéciaux"
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        <label htmlFor="confirmPassword">Confirmez le mot de passe</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
        />

        {error && <p className="error-message">{error}</p>}

        <button type="submit">S'inscrire</button>
      </form>
    </main>
  );
};

export default Register;

import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Register.scss";
import Title from "../components/Title";
import Button from "../components/Button";

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
      await axios.post(import.meta.env.VITE_API_URL + "/auth/register", {
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
      <Title text="Inscription"></Title>
      <form onSubmit={handleSubmit} className="register-form">
        <label id="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          aria-labelledby="email"
          aria-label="saisir votre email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
        />

        <label id="pseudo">Pseudo</label>
        <input
          id="pseudo"
          type="text"
          name="pseudo"
          aria-labelledby="pseudo"
          aria-label="saisir votre pseudo"
          value={formData.pseudo}
          onChange={handleChange}
          required
          aria-required="true"
          minLength={5}
          maxLength={20}
          pattern="^[A-Za-z0-9]{5,20}$"
          title="5 à 20 caractères alphanumériques, sans espaces ni caractères spéciaux"
        />

        <label id="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          name="password"
          aria-labelledby="password"
          aria-label="saisir votre mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
          aria-required="true"
          minLength={6}
        />

        <label id="confirmPassword">Confirmez le mot de passe</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          aria-labelledby="confirm password"
          aria-label="confirmez votre mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          aria-required="true"
          minLength={6}
        />

        {error && <p className="error-message">{error}</p>}

        <Button
          onClick={null}
          className="btn"
          buttonType="submit"
          text="S'inscrire"
        ></Button>
      </form>
    </main>
  );
};

export default Register;

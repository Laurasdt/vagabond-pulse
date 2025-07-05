import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Register.scss";
import Title from "../components/Title";
import Button from "../components/Button";
import { toast } from "sonner";
import { BeatLoader } from "react-spinners";


const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

  const validatePseudo = (pseudo) => /^[A-Za-z0-9]{3,20}$/.test(pseudo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validatePseudo(formData.pseudo)) {
      setError(
        "Le pseudo doit faire entre 3 et 20 caractères alphanumériques, sans espaces ni caractères spéciaux."
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_API_URL + "/auth/register", {
        email: formData.email,
        pseudo: formData.pseudo,
        password: formData.password,
      });
      toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setIsLoading(false);
      navigate("/login");
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      toast.error(err.message);
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    }
  };

  return (
    <main className="register-page">
      {/* <Toaster richColors></Toaster> */}
      <Title text="Inscription"></Title>
      <form onSubmit={handleSubmit} className="register-form">
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
        />

        <label htmlFor="pseudo">Pseudo</label>
        <input
          id="pseudo"
          type="text"
          name="pseudo"
          value={formData.pseudo}
          onChange={handleChange}
          required
          aria-required="true"
          minLength={3}
          maxLength={20}
          pattern="^[A-Za-z0-9]{3,20}$"
          title="3 à 20 caractères alphanumériques, sans espaces ni caractères spéciaux"
        />

        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          aria-required="true"
        />

        <label htmlFor="confirmPassword">Confirmez le mot de passe</label>
        <input
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          aria-required="true"
        />
{isLoading===true ? (
  <>
  
  <BeatLoader size={15} color="#ffffff"/>
  </>
  

): (

  <Button
          onClick={null}
          className="btn"
          buttonType="submit"
          text="S'inscrire"
        ></Button>
)}
        
      </form>
    </main>
  );
};

export default Register;

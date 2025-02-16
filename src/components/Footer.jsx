import React from "react";
import "../styles/components/Footer.scss";
import logo from "../assets/img/logo3WA.png";

const Footer = () => {
  return (
    <footer className="footer">
      <a href="https://3wacademy.fr/" target="_blank" rel="noopener noreferrer">
        <img src={logo} alt="3WA Logo" className="footer-logo" />
      </a>
      <div className="links">
        <a href="#">Mentions légales</a>
        <a href="#">Politique de confidentialité</a>
      </div>
      <p className="credits">
        Réalisé par{" "}
        <a
          href="https://github.com/Laurasdt"
          target="_blank"
          rel="noopener noreferrer"
        >
          Laura Schmidt
        </a>
      </p>
    </footer>
  );
};

export default Footer;

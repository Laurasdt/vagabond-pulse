import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/components/Header.scss";
import Button from "./Button";
import Title from "./Title";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
      if (window.innerWidth > 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMenu = () => setIsMenuOpen((open) => !open);
  const handleLoginClick = () => navigate("/login");
  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  // si admin, montrer "users"
  const renderAdminLinks = () => (
    <>
      <li>
        <Link to="/admin">Users</Link>
      </li>
      <li>
        <Button
          buttonType="button"
          className="logout-btn"
          text="Se déconnecter"
          onClick={handleLogoutClick}
        />
      </li>
    </>
  );

  return (
    <header className="header">
      <Title text="Vagabond Pulse"></Title>
      {/* Nav desktop */}
      {!isMobile && (
        <nav className="nav-desktop">
          <ul>
            {user?.role === "admin" ? (
              renderAdminLinks()
            ) : (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/gallery">Galerie</Link>
                </li>
                {isAuthenticated && (
                  <li>
                    <Link to="/profile">Profil</Link>
                  </li>
                )}
                {isAuthenticated ? (
                  <>
                    <li>
                      <Link to="/create-event">Créer un événement</Link>
                    </li>
                    <li>
                      <Button
                        buttonType="button"
                        className="logout-btn"
                        text="Se déconnecter"
                        onClick={handleLogoutClick}
                      />
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/register" className="register-btn">
                        S'inscrire
                      </Link>
                    </li>
                    <li>
                      <Button
                        buttonType="button"
                        className="logout-btn"
                        text="Se connecter"
                        onClick={handleLoginClick}
                      />
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
      )}
      {/* MOBILE NAV */}
      {isMobile && (
        <>
          <button
            className="burger-icon"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>

          <nav className={`nav-mobile ${isMenuOpen ? "open" : ""}`}>
            <ul>
              {user?.role === "admin" ? (
                <>
                  <li>
                    <Link to="/admin" onClick={toggleMenu}>
                      Users
                    </Link>
                  </li>
                  <li>
                    <Button
                      buttonType="button"
                      className="logout-btn"
                      text="Se déconnecter"
                      onClick={() => {
                        handleLogoutClick();
                        toggleMenu();
                      }}
                    />
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/" onClick={toggleMenu}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/gallery" onClick={toggleMenu}>
                      Galerie
                    </Link>
                  </li>
                  {isAuthenticated && (
                    <li>
                      <Link to="/profile" onClick={toggleMenu}>
                        Profil
                      </Link>
                    </li>
                  )}
                  {isAuthenticated ? (
                    <>
                      <li>
                        <Link to="/create-event" onClick={toggleMenu}>
                          Créer un événement
                        </Link>
                      </li>
                      <li>
                        <Button
                          buttonType="button"
                          className="logout-btn"
                          text="Se déconnecter"
                          onClick={() => {
                            handleLogoutClick();
                            toggleMenu();
                          }}
                        />
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/register" onClick={toggleMenu}>
                          S'inscrire
                        </Link>
                      </li>
                      <li>
                        <Button
                          buttonType="button"
                          className="logout-btn"
                          text="Se connecter"
                          onClick={() => {
                            handleLoginClick();
                            toggleMenu();
                          }}
                        />
                      </li>
                    </>
                  )}
                </>
              )}
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}

export default Header;

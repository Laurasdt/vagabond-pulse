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
  const renderAdminLinks = (isMobileVersion = false) => (
    <>
      <li>
        <Link
          to="/admin"
          aria-label="Gérer les utilisateurs"
          onClick={isMobileVersion ? toggleMenu : undefined}
        >
          Users
        </Link>
      </li>
      <li>
        <Link to="/" onClick={isMobileVersion ? toggleMenu : undefined}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/gallery" onClick={isMobileVersion ? toggleMenu : undefined}>
          Galerie
        </Link>
      </li>
      <li>
        <Link to="/profile" onClick={isMobileVersion ? toggleMenu : undefined}>
          Profil
        </Link>
      </li>
      <li>
        <Link
          to="/create-event"
          onClick={isMobileVersion ? toggleMenu : undefined}
        >
          Créer un événement
        </Link>
      </li>
      <li>
        <Button
          buttonType="button"
          className="logout-btn"
          text="Se déconnecter"
          onClick={
            isMobileVersion
              ? () => {
                  handleLogoutClick();
                  toggleMenu();
                }
              : handleLogoutClick
          }
          aria-label="Se déconnecter"
        />
      </li>
    </>
  );

  return (
    <header className="header">
      <Title text="Vagabond Pulse"></Title>
      {/* Nav desktop */}
      {!isMobile && (
        <nav
          className="nav-desktop"
          role="navigation"
          aria-label="Menu principal"
        >
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
                        aria-label="Se déconnecter"
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
                        aria-label="Se connecter"
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
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className="bar" aria-hidden="true" />
            <span className="bar" aria-hidden="true" />
            <span className="bar" aria-hidden="true" />
          </button>

          <nav
            id="mobile-menu"
            className={`nav-mobile ${isMenuOpen ? "open" : ""}`}
            role="navigation"
            aria-label="Menu mobile"
            aria-hidden={!isMenuOpen}
          >
            <ul>
              {user?.role === "admin" ? (
                renderAdminLinks(true)
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

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/components/Header.scss";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
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

  const toggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <h1>Vagabond Pulse</h1>

      {!isMobile && (
        <nav className="nav-desktop">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/gallery">Galerie</Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            )}
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/create-event">Créer un événement</Link>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogoutClick}>
                    Se déconnecter
                  </button>
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
                  <button className="login-btn" onClick={handleLoginClick}>
                    Se connecter
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}

      {isMobile && (
        <>
          <button
            className="burger-icon"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

          <nav className={`nav-mobile ${isMenuOpen ? "open" : ""}`}>
            <ul>
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
                    Profile
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
                    <button
                      className="logout-btn"
                      onClick={() => {
                        handleLogoutClick();
                        toggleMenu();
                      }}
                    >
                      Se déconnecter
                    </button>
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
                    <button
                      className="login-btn"
                      onClick={() => {
                        handleLoginClick();
                        toggleMenu();
                      }}
                    >
                      Se connecter
                    </button>
                  </li>
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

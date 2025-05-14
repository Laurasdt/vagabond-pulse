import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages/Gallery.scss";

const Gallery = () => {
  const [memories, setMemories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/memories");
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.memories || [];
        setMemories(data);
        setError("");
      } catch (err) {
        console.error("Erreur fetch gallery :", err);
        setError("Impossible de charger la galerie.");
      }
    };
    fetchGallery();
  }, []);

  const API_BASE = "http://localhost:5000";
  const FALLBACK = "/fallback.jpg";

  return (
    <div className="gallery-page">
      <h1>Galerie</h1>
      {error && <p className="error">{error}</p>}
      <div className="gallery-grid">
        {memories.map((m) => {
          // Sécurisation de l'URL
          let imgUrl = FALLBACK;
          if (m.photo_url && typeof m.photo_url === "string") {
            imgUrl = m.photo_url.startsWith("http")
              ? m.photo_url
              : `${API_BASE}${m.photo_url}`;
          }

          return (
            <div key={m.id} className="photo-item">
              <img
                src={imgUrl}
                alt={m.description || "Memory"}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK;
                }}
              />
              <div className="overlay">
                <span className="owner">{m.pseudo || "Anonyme"}</span>
                <p>{m.description || "Pas de description"}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/pages/Gallery.scss";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/memories")
      .then(({ data }) => setPhotos(data))
      .catch((err) => console.error("Erreur fetch gallery :", err));
  }, []);

  return (
    <main className="gallery-page">
      <h1>Galerie</h1>
      {photos.length === 0 ? (
        <p>Aucune photo disponible.</p>
      ) : (
        <div className="gallery-grid">
          {photos.map((mem) => (
            <div key={mem.id} className="photo-item">
              <img
                src={`http://localhost:5000${mem.photoUrl}`}
                alt={mem.description || "Photo utilisateur"}
              />
              <div className="overlay">
                <span className="owner">@{mem.owner}</span>
                {mem.description && <p>{mem.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Gallery;

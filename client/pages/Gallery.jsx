import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/pages/Gallery.scss";
import Title from "../components/Title";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/memories")
      .then(({ data }) => setPhotos(data))
      .catch((err) => console.error("Erreur fetch gallery :", err));
  }, []);

  return (
    <main className="gallery-page">
      <Title text="Galerie"></Title>
      {photos.length === 0 ? (
        <p>Aucune photo disponible.</p>
      ) : (
        <div className="gallery-grid">
          {photos.map((mem) => (
            <div key={mem.id} className="photo-item">
              <img
                src={`http://localhost:3001${mem.photoUrl}`}
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

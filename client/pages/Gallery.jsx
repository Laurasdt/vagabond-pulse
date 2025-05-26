import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/components/gallery.scss";

const Gallery = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/memories/${userId}`)
      .then((res) => setMemories(res.data))
      .catch((err) => console.error("Erreur fetch memories :", err));
  }, [userId]);

  // Calcule la racine du backend sans "/api"
  const backendRoot = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

  return (
    <div className="gallery">
      {memories.length === 0 ? (
        <p>Aucun souvenir disponible.</p>
      ) : (
        <div className="gallery-grid">
          {memories.map((mem) => (
            <div key={mem.id} className="gallery-item">
              <img
                src={`${backendRoot}${mem.photoUrl}`}
                alt={mem.description || "Souvenir utilisateur"}
              />
              <p className="description">{mem.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;

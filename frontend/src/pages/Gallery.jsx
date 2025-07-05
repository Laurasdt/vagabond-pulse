import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/pages/Gallery.scss";
import Title from "../components/Title";
import { BACKEND_URI} from "../Constante/constante";
import { useAuth } from "../context/AuthContext";
import { Button } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as Btton,
} from "@mui/material";


const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const { user, isAuthenticated } = useAuth();
const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const HandleDeleteMemoryClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };
  const handleConfimDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/memories/${deleteId}`
      );
      setPhotos((prev) => prev.filter((m) => m.id !== deleteId));
      toast.dismiss();
      toast.success("memory supprimé avec succès");
    } catch (error) {
      console.log("erreur de suppression du memory");
      toast.dismiss();
      toast.error("Impossible de supprimer ce memory");
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };


  useEffect(() => {
    fetchData();
  }, [axios]);
  const fetchData = async() => {
    try {
      const response = await axios
      .get(`${BACKEND_URI}/api/memories`)
      setPhotos(response.data)
    } catch (error) {
      toast.error('Erreur lors de la récupération des memories')
    }
  }

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
                src={`${BACKEND_URI_DEV}${mem.photoUrl}`}
                alt={`Photo de ${mem.owner} : ${
                  mem.description || "souvenir partagé"
                }`}
                loading="lazy"
                sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <div className="overlay">
                {mem.description && <p>{mem.description}</p>}
                <span className="owner">@{mem.owner}</span>
              {isAuthenticated && (user?.role === "admin" || user?.pseudo === mem.owner) && (
                  <button onClick={() => HandleDeleteMemoryClick(mem.id)}>
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Supprimer ce memory ?
        </DialogTitle>
        <DialogContent>
          <p>Etes-vous sûr de vouloir supprimer definitivement ce memory ?</p>
        </DialogContent>
        <DialogActions>
          <Btton onClick={() => setConfirmOpen(false)}>Annuler</Btton>
          <Btton onClick={handleConfimDelete} color="error" autoFocus>
            Supprimer
          </Btton>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Gallery;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import "../styles/pages/profile.scss";
import Title from "../components/Title";
import Button from "../components/Button";
import { toast } from "sonner";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as Btton,
} from "@mui/material";
import { BeatLoader } from "react-spinners";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  const [memories, setMemories] = useState([]);
  const [events, setEvents] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [whichButtonClicked, setWhichButtonClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleWichButtonClicked = (buttonClicked, id) => {
    setWhichButtonClicked(buttonClicked);
    if (buttonClicked==='memory') {
      HandleDeleteMemoryClick(id)
    } else {
      handleDeleteEventClicked(id);
    }
  }
  const handleDeleteEventClicked = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  }
  const HandleDeleteMemoryClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };
  const handleConfimDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/memories/${deleteId}`
      );
      setMemories((prev) => prev.filter((m) => m.id !== deleteId));
      toast.dismiss();
      toast.success("memory supprimée avec succès");
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
    if (!userId) return;
    const fetchDataMemories = async() => {
      setIsLoading(true)
      try {
        const memData = await axios.get(`${import.meta.env.VITE_API_URL}/memories/${userId}`)
        setIsLoading(false)
        setMemories(memData.data)
      } catch (error) {
        setIsLoading(false)
        toast.error('Erreur lors de la récupération des memories');
        
      }
    }
    fetchDataMemories()
  }, [userId]);

  // Récupération des événements de l'utilisateur
  useEffect(() => {
    if (!userId) return;
    axios
      .get(import.meta.env.VITE_API_URL + "/events?page=1&limit=100")
      .then(({ data }) => {
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.events)
          ? data.events
          : [];
        const myEvents = list.filter(
          (e) => e.user_id === userId || e.userId === userId
        );
        setEvents(myEvents);
      })
      .catch((err) => console.error("Erreur fetch events :", err));
  }, [userId]);

  // Handlers pour le formulaire de souvenir
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleDescriptionChange = (e) => setDescription(e.target.value);

  // Envoi du souvenir
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Veuillez sélectionner une image.");
    if (!description.trim())
      return toast.error("La description est obligatoire.");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file); // formData est un tableau temporaire qui contient clé, valeur
      formData.append("description", description);
      formData.append("userId", userId);
      const res = await axios.post( //envoi une requête POST vers route api/memories
        import.meta.env.VITE_API_URL + "/memories", 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMemories((prev) => [res.data, ...prev]);
      setFile(null);
      setDescription("");
      e.target.reset();
    } catch (err) {
      console.error("Erreur upload memory :", err);
      toast.error(err.error);
    } finally {
      setIsUploading(false);
    }
  };

  // supprimer event
  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/events/${deleteId}`);
      setEvents((prev) => prev.filter((e) => e.id !== deleteId));
      setConfirmOpen(false);
      toast.success("Événement supprimé !");
    } catch (err) {
      console.error("Erreur suppression event :", err);
      toast.error("Erreur lors de la suppression.");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="profile-page">
        <Title text="Mon profil"></Title>
        <p>Veuillez vous connecter pour voir votre profil.</p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <Title text="Profil" />
      {/* <Toaster richColors /> */}
      <section
        className="memories-upload"
        aria-labelledby="memories-upload-heading"
      >
        <h2 id="memories-upload-heading">Ajouter un souvenir</h2>
        <form className="memory-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="memory-file">Photo</label>
            <input
              id="memory-file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              aria-describedby="file-help"
              disabled={isUploading}
            />
            <small id="file-help" className="form-help">
              Formats acceptés : JPG, PNG, GIF (max 5MB)
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="memory-description">Description</label>
            <input
              id="memory-description"
              type="text"
              placeholder="Petite description..."
              value={description}
              onChange={handleDescriptionChange}
              required
              maxLength={100}
              aria-describedby="description-help"
              disabled={isUploading}
            />
            <small id="description-help" className="form-help">
              Maximum 100 caractères ({description.length}/100)
            </small>
          </div>
          <Button
            onClick={null}
            className="btn"
            buttonType="submit"
            text={isUploading ? "Envoi en cours..." : "Envoyer"}
            disabled={isUploading}
          />
        </form>
      </section>

      <section className="memories-gallery" aria-labelledby="memories-heading">
        <h2 id="memories-heading">Mes Souvenirs ({memories.length})</h2>
        {isLoading ? (
<BeatLoader color={'#ffffff'} size={15}></BeatLoader>
) : memories.length === 0 ? (
  <p>Aucun souvenir pour l’instant.</p>
) : (
  <div className="gallery-grid">
    {memories.map((mem) => (
      <article key={mem.id} className="memory-item">
        <img
          src={`${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}${mem.photoUrl}`}
          alt={`Photo de ${mem.owner} : ${mem.description || "souvenir"}`}
          loading="lazy"
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
        />
        <div className="memory-info">
          <p>{mem.description}</p>
          <button
            className="btn-delete-memory"
            onClick={() => handleWichButtonClicked('memory', mem.id)}
            aria-label="supprimer ce memory"
          >
            Supprimer
          </button>
        </div>
      </article>
    ))}
  </div>
)}
       
      </section>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Supprimer ce {whichButtonClicked==='memory'? 'memory' : 't événement'}  ?
        </DialogTitle>
        <DialogContent>
          <p>Etes-vous sûr de vouloir supprimer definitivement cet {whichButtonClicked==='memory'? 'memory' : 'événement'} ?</p>
        </DialogContent>
        <DialogActions>
          <Btton onClick={() => setConfirmOpen(false)}>Annuler</Btton>
          <Btton onClick={whichButtonClicked==='memory' ? handleConfimDelete:handleDeleteEvent} color="error" autoFocus>
            Supprimer
          </Btton>
        </DialogActions>
      </Dialog>

      <section className="user-events" aria-labelledby="events-heading">
        <h2 id="events-heading">Mes Événements ({events.length})</h2>
        {events.length === 0 ? (
          <p>Vous n’avez pas encore créé d’événement.</p>
        ) : (
          <ul className="events-list">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUserId={userId}
                onDelete={handleWichButtonClicked}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import "../styles/pages/profile.scss";
import Title from "../components/Title";

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;

  const [memories, setMemories] = useState([]);
  const [events, setEvents] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  // Récupération des souvenirs de l'utilisateur
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/memories/${userId}`)
      .then((res) => setMemories(res.data))
      .catch((err) => console.error("Erreur fetch memories :", err));
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
    if (!file) return alert("Veuillez sélectionner une image."); // si aucun fichier selectionné
    if (!description.trim()) return alert("La description est obligatoire."); // si pas de description
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      formData.append("userId", userId);
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/memories",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMemories((prev) => [res.data, ...prev]);
      setFile(null);
      setDescription("");
    } catch (err) {
      console.error("Erreur upload memory :", err);
      alert("Échec de l’envoi. Réessaie plus tard.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet événement ?"))
      return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      alert("Événement supprimé !");
    } catch (err) {
      console.error("Erreur suppression event :", err);
      alert("Erreur lors de la suppression.");
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
      <Title text="Profil"></Title>

      <section className="memories-upload">
        <h2>Ajouter un souvenir</h2>
        <form className="memory-form" onSubmit={handleSubmit}>
          <label className="form-group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </label>
          <label className="form-group">
            <input
              type="text"
              placeholder="Petite description..."
              value={description}
              onChange={handleDescriptionChange}
              required
            />
          </label>
          <button type="submit" className="btn">
            Envoyer
          </button>
        </form>
      </section>

      <section className="memories-gallery">
        <h2>Mes Souvenirs</h2>
        {memories.length === 0 ? (
          <p>Aucun souvenir pour l’instant.</p>
        ) : (
          <div className="gallery-grid">
            {memories.map((mem) => (
              <article key={mem.id} className="memory-item">
                <img
                  src={`${import.meta.env.VITE_API_URL.replace(/\/api$/, "")}${
                    mem.photoUrl
                  }`}
                  alt={mem.description || "Photo utilisateur"}
                />
                <div className="memory-info">
                  <p>{mem.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="user-events">
        <h2>Mes Événements</h2>
        {events.length === 0 ? (
          <p>Vous n’avez pas encore créé d’événement.</p>
        ) : (
          <ul className="events-list">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUserId={userId}
                onDelete={handleDeleteEvent}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Profile;

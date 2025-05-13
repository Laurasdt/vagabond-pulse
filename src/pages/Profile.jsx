import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/profile.scss";
import EventCard from "../components/EventCard";

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id;

  const [memories, setMemories] = useState([]);
  const [events, setEvents] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  // Récupère les souvenirs existants
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/memories/${userId}`)
      .then((res) => setMemories(res.data))
      .catch((err) => console.error("Erreur fetch memories :", err));
  }, [userId]);

  // Récupère les events créés par l'utilisateur
  useEffect(() => {
    if (!userId) return;
    const fetchUserEvents = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/events?page=1&limit=100`
        );
        const myEvents = data.events.filter((e) => e.userId === userId);
        setEvents(myEvents);
      } catch (err) {
        console.error("Erreur fetch events :", err);
      }
    };
    fetchUserEvents();
  }, [userId]);

  // Upload d'un souvenir
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Veuillez sélectionner une image.");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      formData.append("userId", userId);

      const res = await axios.post(
        "http://localhost:5000/api/memories",
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

  // Suppression d'un event de l'utilisateur
  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
          data: { userId },
        });
        setEvents(events.filter((e) => e.id !== eventId));
        alert("Événement supprimé avec succès !");
      } catch (err) {
        console.error("Erreur suppression event :", err);
        alert("Erreur lors de la suppression de l'événement.");
      }
    }
  };

  return (
    <main className="profile-page">
      <h1>Mon Profil</h1>

      {/* Section souvenirs */}
      <section className="memories-upload">
        <h2>Ajouter un souvenir</h2>
        <form className="memory-form" onSubmit={handleSubmit}>
          <label className="form-group">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          <label className="form-group">
            <input
              type="text"
              placeholder="Petite description."
              value={description}
              onChange={handleDescriptionChange}
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
                  src={`http://localhost:5000${mem.photoUrl}`}
                  alt={mem.description}
                />
                <div className="memory-info">
                  <p>{mem.description}</p>
                  <small>{new Date(mem.createdAt).toLocaleString()}</small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Section Mes événements */}
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

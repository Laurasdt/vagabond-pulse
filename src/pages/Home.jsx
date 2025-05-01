import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/pages/Home.scss";

const Home = () => {
  const [events, setEvents] = useState([]); // state pour stocker les événements
  const [loading, setLoading] = useState(true); // state pour gérer le chargement

  // récupère les événements depuis l'API backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data); // stocke les event dans l'état
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      } finally {
        setLoading(false); // fin du chargement
      }
    };

    fetchEvents();
  }, []); // s'exécute une seule fois au chargement du composant

  // supprime un événement
  const handleDelete = async (eventId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${eventId}`);
        alert("Événement supprimé avec succès !");
        // reload les event
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        alert("Erreur lors de la suppression de l'événement.");
      }
    }
  };

  if (loading) {
    return <p>Chargement des événements...</p>;
  }

  return (
    <main className="home">
      <h2>Événements</h2>
      {events.length === 0 ? (
        <p>Aucun événement disponible</p>
      ) : (
        <ul className="events-list">
          {events.map((event) => (
            <li key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>
                <strong>Lieu :</strong> {event.location}
              </p>
              <p>
                <strong>Date :</strong> {event.date}
              </p>
              <Link to={`/event/${event.id}`} className="details-btn">
                En savoir +
              </Link>
              <button
                onClick={() => handleDelete(event.id)}
                className="delete-btn"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Home;

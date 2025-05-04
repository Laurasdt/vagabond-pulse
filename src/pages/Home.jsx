import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/pages/Home.scss";

const Home = () => {
  const [events, setEvents] = useState([]); // state pour stocker les événements
  const [loading, setLoading] = useState(true); // state pour gérer le chargement
  const [page, setPage] = useState(1); // state pour gérer la page actuelle
  const [totalPages, setTotalPages] = useState(1); // state pour gérer le nombre total de pages

  // récupère les événements depuis l'API backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/events?page=${page}&limit=10`
        );
        setEvents(response.data);
        // Si l'API retourne également le nombre total de pages, tu peux l'utiliser ici
        // setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      } finally {
        setLoading(false); // fin du chargement
      }
    };

    fetchEvents();
  }, [page]); // s'exécute à chaque fois que la page change

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
              <Link to={`/edit-event/${event.id}`} className="update-btn">
                Mettre à jour{" "}
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

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1} // Désactive le bouton Précédent si on est à la première page
          className="pagination-btn"
        >
          Précédent
        </button>
        <span>
          Page {page} sur {totalPages}
        </span>{" "}
        {/*numéro de la page actuelle */}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages} // Désactive le bouton Suivant si on est à la dernière page
          className="pagination-btn"
        >
          Suivant
        </button>
      </div>
    </main>
  );
};

export default Home;

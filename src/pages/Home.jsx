import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/pages/Home.scss";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
        // reload les événements
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
          {events.map((event) => {
            // Formate la date avec date-fns
            const eventDate = new Date(event.date); // Crée un objet Date à partir de la date de l'événement
            const formattedDate = format(eventDate, "eeee d MMMM yyyy", {
              locale: fr,
            }); // format français "Vendredi 3 avril 2025"
            const formattedTime = format(eventDate, "HH:mm"); //  format "10h30"

            return (
              <li key={event.id} className="event-card">
                <h3>{event.title}</h3>
                <p>
                  <strong>Lieu :</strong> {event.location}
                </p>
                <p>
                  <strong>Date :</strong> {formattedDate}{" "}
                </p>
                <p>
                  <strong>Heure :</strong> {formattedTime}{" "}
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
            );
          })}
        </ul>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="pagination-btn"
        >
          Précédent
        </button>
        <div class="pageNumber">
          Page {page} sur {totalPages}
        </div>{" "}
        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="pagination-btn"
        >
          Suivant
        </button>
      </div>
    </main>
  );
};

export default Home;

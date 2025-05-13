import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/Home.scss";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/events?page=${page}&limit=10`
        );
        setEvents(data.events);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]);

  const handleDelete = async (eventId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
          data: { userId: user.id },
        });
        alert("Événement supprimé avec succès !");
        setEvents(events.filter((e) => e.id !== eventId));
      } catch (error) {
        console.error("Erreur lors de la suppression de l'événement :", error);
        alert("Erreur lors de la suppression de l'événement.");
      }
    }
  };

  if (loading) return <p>Chargement des événements...</p>;

  return (
    <main className="home">
      <h1>Événements</h1>
      {events.length === 0 ? (
        <p>Aucun événement disponible</p>
      ) : (
        <ul className="events-list">
          {events.map((event) => {
            const iso = event.date.includes("T")
              ? event.date
              : event.date.replace(" ", "T");
            const eventDate = parseISO(iso);
            const formattedDate = format(eventDate, "eeee d MMMM yyyy", {
              locale: fr,
            });
            const formattedTime = format(eventDate, "HH:mm");

            return (
              <li key={event.id} className="event-card">
                <h2>{event.title}</h2>
                <p>
                  <strong>Lieu :</strong> {event.location}
                </p>
                <p>
                  <strong>Date :</strong> {formattedDate}
                </p>
                <p>
                  <strong>Heure :</strong> {formattedTime}
                </p>
                <Link to={`/event/${event.id}`} className="details-btn">
                  En savoir +
                </Link>
                {isAuthenticated && event.userId === user.id && (
                  <>
                    <Link to={`/edit-event/${event.id}`} className="update-btn">
                      Mettre à jour
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="delete-btn"
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <div className="pagination">
        <button
          onClick={() => setPage((p) => p - 1)}
          disabled={page === 1}
          className="pagination-btn"
        >
          Précédent
        </button>
        <div className="pageNumber">
          Page {page} sur {totalPages}
        </div>
        <button
          onClick={() => setPage((p) => p + 1)}
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

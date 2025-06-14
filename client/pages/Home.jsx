import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import "../styles/pages/Home.scss";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Récupération des événements depuis l'API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/events?page=${page}&limit=10`
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

  // Fonction pour supprimer un événement + vérifie si l'utilisateur a confirmé la suppression avant de procéder
  const handleDelete = async (eventId) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/events/${eventId}`,
          {
            data: { userId: user.id },
          }
        );
        alert("Événement supprimé avec succès !");
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
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
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              currentUserId={isAuthenticated ? user.id : null}
              currentUserRole={isAuthenticated ? user.role : null}
              onDelete={handleDelete}
            />
          ))}
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

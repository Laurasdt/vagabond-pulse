import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/EventDetails.scss";

const EventDetails = () => {
  const { eventId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/events/${eventId}`)
      .then(({ data }) => setEvent(data))
      .catch((err) => {
        console.error("Erreur fetch event details :", err);
        setError("Impossible de charger les détails de l'événement.");
      });
  }, [eventId]);

  if (error) return <p className="error">{error}</p>;
  if (!event) return <p>Chargement...</p>;

  const evtDate = new Date(event.date);
  const formattedDate = evtDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const formattedTime = evtDate
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    .replace(":", "H");

  const isOwner = isAuthenticated && event.user_id === user.id;
  const isAdmin = isAuthenticated && user.role === "admin";

  return (
    <main className="event-details">
      <h1>{event.title}</h1>
      <div className="event-meta">
        <div>
          <strong>Date :</strong> {formattedDate}
        </div>
        <div>
          <strong>Heure :</strong> {formattedTime}
        </div>
        <div>
          <strong>Lieu :</strong> {event.location}
        </div>
      </div>
      <div className="event-description">
        <strong>Description :</strong>
        <p>{event.description}</p>
      </div>
      <div className="buttons">
        <Link to="/" className="btn">
          Retour
        </Link>
        {(isOwner || isAdmin) && (
          <Link to={`/edit-event/${event.id}`} className="btn">
            Modifier
          </Link>
        )}
      </div>
    </main>
  );
};

export default EventDetails;

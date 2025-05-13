import React from "react";
import { Link } from "react-router-dom";
import { parseISO, format } from "date-fns";
import { fr } from "date-fns/locale";

const EventCard = ({ event, currentUserId, onDelete }) => {
  // pour gérer le format MySQL ou ISO
  const iso = event.date.includes("T")
    ? event.date
    : event.date.replace(" ", "T");
  const eventDate = parseISO(iso);
  const formattedDate = format(eventDate, "eeee d MMMM yyyy", { locale: fr });
  const formattedTime = format(eventDate, "HH:mm");
  const isOwner = currentUserId && event.userId === currentUserId;

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
      {isOwner && (
        <>
          <Link to={`/edit-event/${event.id}`} className="update-btn">
            Mettre à jour
          </Link>
          <button onClick={() => onDelete(event.id)} className="delete-btn">
            Supprimer
          </button>
        </>
      )}
    </li>
  );
};

export default EventCard;

import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event, currentUserId, currentUserRole }) => {
  const isOwner =
    currentUserId &&
    (event.user_id === currentUserId || event.userId === currentUserId);
  const isAdmin = currentUserRole === "admin";

  // Formatage date et heure
  const evtDate = new Date(event.date);
  const formattedDate = evtDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const formattedTime = evtDate.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="event-card">
      <h2 className="event-title">{event.title}</h2>

      <div className="event-info">
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

      <div className="buttons">
        <Link to={`/event/${event.id}`} className="details-btn">
          Détails
        </Link>
        {(isOwner || isAdmin) && (
          <>
            <Link to={`/edit-event/${event.id}`} className="update-btn">
              Modifier
            </Link>
            <button
              className="delete-btn"
              onClick={() =>
                window.confirm("Supprimer cet événement ?") &&
                fetch(`/api/events/${event.id}`, { method: "DELETE" }).then(
                  (res) => {
                    if (res.ok) window.location.reload();
                    else alert("Impossible de supprimer l'événement");
                  }
                )
              }
            >
              Supprimer
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default EventCard;

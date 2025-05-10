import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/pages/EventDetails.scss";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/events/${eventId}`
        );
        setEvent(data);
      } catch (error) {
        console.error("Erreur récupération détails :", error);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (!event) return <p>Chargement...</p>;

  const iso = event.date.includes("T")
    ? event.date
    : event.date.replace(" ", "T");
  const dateObj = parseISO(iso);

  return (
    <main className="event-details">
      <h2>{event.title}</h2>
      <p>
        <strong>Lieu :</strong> {event.location}
      </p>
      <p>
        <strong>Date :</strong>{" "}
        {format(dateObj, "eeee d MMMM yyyy", { locale: fr })}
      </p>
      <p>
        <strong>Heure :</strong> {format(dateObj, "HH:mm")}
      </p>
      <p>
        <strong>Description :</strong> {event.description}
      </p>
    </main>
  );
};

export default EventDetails;

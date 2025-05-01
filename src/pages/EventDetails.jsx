import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/pages/EventDetails.scss";

const EventDetails = () => {
  const { eventId } = useParams(); // récupère l'ID de l'évent depuis l'URL
  const [event, setEvent] = useState(null); // stocke les données de l'évent

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/events/${eventId}`
        );
        setEvent(response.data); // stocke les détails de l'évent
      } catch (error) {
        console.error("Erreur lors de la récupération de l'événement :", error);
      }
    };

    fetchEventDetails();
  }, [eventId]); // la fonction se réexécute si l'ID de l'évent change

  if (!event) {
    return <p>Chargement des détails de l'événement...</p>;
  }

  return (
    <main className="event-details">
      <h2>{event.title}</h2>
      <p>
        <strong>Lieu :</strong> {event.location}
      </p>
      <p>
        <strong>Date :</strong> {event.date}
      </p>
      <p>
        <strong>Description :</strong> {event.description}
      </p>
    </main>
  );
};

export default EventDetails;

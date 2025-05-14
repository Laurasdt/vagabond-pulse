import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/pages/CreateEvent.scss";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const CreateEvent = () => {
  const { isAuthenticated, user } = useAuth();
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // validation de la date et de l'heure => max un an plus tard
  const validateDate = (date, time) => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setFullYear(today.getFullYear() + 1);

    const eventDate = new Date(`${date}T${time}:00`);

    // Vérifie que la date n'est pas déjà passée
    if (eventDate < today) {
      alert("Tu ne peux pas prévoir d'évènement dans le passé ;)");
      return false;
    }
    if (eventDate > maxDate) {
      alert("L'événement ne peut pas être prévu plus d'un an à l'avance.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de la date et de l'heure
    if (!validateDate(eventData.date, eventData.time)) {
      return;
    }

    const dateTime = `${eventData.date}T${eventData.time}:00`;
    const payload = {
      userId: user.id,
      title: eventData.title,
      date: dateTime,
      location: eventData.location,
      description: eventData.description,
    };

    try {
      await axios.post("http://localhost:5000/api/events", payload);
      alert("Super, l'événement a été créé avec succès !!");
      setEventData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'événement :", error);
      alert("Erreur lors de la création de l'événement.");
    }
  };

  return (
    <main className="create-event">
      <h2>Créer un événement</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <label>
          Nom de l'événement :
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date :
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
            min={format(new Date(), "yyyy-MM-dd")} // La date minimum est aujourd'hui
            max={format(
              new Date().setFullYear(new Date().getFullYear() + 1),
              "yyyy-MM-dd"
            )} // La date maximum est un an après
          />
        </label>
        <label>
          Heure :
          <input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Lieu :
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description :
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Créer l'événement</button>
      </form>
    </main>
  );
};

export default CreateEvent;

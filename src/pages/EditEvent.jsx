import React, { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import "../styles/pages/EditEvent.scss";

const EditEvent = () => {
  const { isAuthenticated, user } = useAuth();
  const token = user?.token;
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirection si non authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    if (!token) return;
    axios
      .get(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        const dt = new Date(data.date);
        setEventData({
          title: data.title,
          date: format(dt, "yyyy-MM-dd"),
          time: format(dt, "HH:mm"),
          location: data.location,
          description: data.description,
        });
      })
      .catch((err) => {
        console.error("Erreur fetch event:", err);
        setError("Impossible de charger l'événement.");
      })
      .finally(() => setLoading(false));
  }, [eventId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const validateDate = (date, time) => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() + 1);
    const eventDate = new Date(`${date}T${time}:00`);
    if (eventDate < today || eventDate > maxDate) {
      alert(`Date invalide. Doit être entre aujourd'hui et dans un an.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDate(eventData.date, eventData.time)) return;

    const dateTime = `${eventData.date}T${eventData.time}:00`;
    const payload = {
      title: eventData.title,
      date: dateTime,
      location: eventData.location,
      description: eventData.description,
    };

    try {
      const res = await axios.put(
        `http://localhost:5000/api/events/${eventId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update response:", res);
      alert("Événement mis à jour avec succès !");
      navigate(`/event/${eventId}`);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err.response || err);
      if (err.response?.status === 401) {
        alert("Non autorisé : vérifiez vos droits ou reloggez-vous.");
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    }
  };

  if (loading) return <p>Chargement de l'événement…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <main className="edit-event">
      <h1>Modifier l'événement</h1>
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
            min={format(new Date(), "yyyy-MM-dd", { locale: fr })}
            max={format(
              new Date().setFullYear(new Date().getFullYear() + 1),
              "yyyy-MM-dd"
            )}
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
        <button type="submit">Mettre à jour l'événement</button>
      </form>
    </main>
  );
};

export default EditEvent;

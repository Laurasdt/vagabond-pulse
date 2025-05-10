import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import "../styles/pages/EditEvent.scss";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/events/${eventId}`
        );

        const iso = data.date.includes("T")
          ? data.date
          : data.date.replace(" ", "T");
        const jsDate = parseISO(iso);
        setEventData({
          title: data.title || "",
          date: format(jsDate, "yyyy-MM-dd"),
          time: format(jsDate, "HH:mm"),
          location: data.location || "",
          description: data.description || "",
        });
      } catch (err) {
        console.error("Erreur récupération événement :", err);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: eventData.title,
        date: `${eventData.date}T${eventData.time}:00`,
        location: eventData.location,
        description: eventData.description,
      };
      await axios.put(`http://localhost:5000/api/events/${eventId}`, payload);
      alert("Événement mis à jour !");
      navigate("/");
    } catch (err) {
      console.error("Erreur mise à jour :", err);
      alert("Erreur lors de la mise à jour");
    }
  };

  return (
    <main className="edit-event">
      <h2>Modifier l'événement</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <label>
          Titre
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Date
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
            min={format(new Date(), "yyyy-MM-dd")}
            max={format(
              new Date().setFullYear(new Date().getFullYear() + 1),
              "yyyy-MM-dd"
            )}
          />
        </label>
        <label>
          Heure
          <input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Lieu
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Mettre à jour</button>
      </form>
    </main>
  );
};

export default EditEvent;

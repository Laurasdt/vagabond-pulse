import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/pages/EditEvent.scss";

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/events/${eventId}`)
      .then(({ data }) => {
        setForm({
          title: data.title,
          date: data.date,
          location: data.location,
          description: data.description,
        });
      })
      .catch((err) => {
        console.error("Erreur fetch event:", err);
        setError("Impossible de charger l'événement.");
      });
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/events/${eventId}`, form);
      navigate(`/event/${eventId}`);
    } catch (err) {
      console.error("Erreur update event:", err);
      setError("Échec de la mise à jour.");
    }
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <main className="edit-event">
      <h1>Modifier l'événement</h1>
      <form onSubmit={handleSubmit} className="form-group">
        <label>
          Titre
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Titre"
          />
        </label>
        <label>
          Date & Heure
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </label>
        <label>
          Lieu
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Lieu"
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
        </label>
        <button type="submit" className="btn">
          Enregistrer
        </button>
      </form>
    </main>
  );
};

export default EditEvent;

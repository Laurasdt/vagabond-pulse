import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import "../styles/pages/CreateEvent.scss";
import Title from "../components/Title";
import Button from "../components/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as Btton
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const { isAuthenticated, user } = useAuth();
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpenDialog = () => {
setOpen(true);
  }
const navigateTo = () => {
navigate('/')
}
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

    // Envoi de la requête POST pour créer l'événement
    // ajouter Token sinon n'importe qui peut créer un event sans être connecté
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/events", payload);
      
      setEventData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
      });
      setOpen(true);
    } catch (error) {
      console.error("Erreur lors de la création de l'événement :", error);
      alert("Erreur lors de la création de l'événement.");
    }
  };

  return (
    <main className="create-event">
      <Title text="Créer un événement"></Title>
      <form onSubmit={handleSubmit} className="event-form">
        <label htmlFor="event-title">Nom de l'événement :</label>
        <input
          id="event-title"
          type="text"
          name="title"
          value={eventData.title}
          onChange={handleChange}
          aria-required="true"
          required
        />
        <label htmlFor="event-date">Date :</label>
        <input
          id="event-date"
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          aria-required="true"
          required
          min={format(new Date(), "yyyy-MM-dd")} // La date minimum est aujourd'hui
          max={format(
            new Date().setFullYear(new Date().getFullYear() + 1),
            "yyyy-MM-dd"
          )} // La date maximum est un an après
        />
        <label htmlFor="event-time">Heure :</label>
        <input
          id="event-time"
          type="time"
          name="time"
          value={eventData.time}
          onChange={handleChange}
          aria-required="true"
          required
        />
        <label htmlFor="event-location">Lieu :</label>
        <input
          id="event-location"
          type="text"
          name="location"
          value={eventData.location}
          onChange={handleChange}
          aria-required="true"
          required
        />
        <label htmlFor="event-description">Description :</label>

        <textarea
          id="event-description"
          name="description"
          value={eventData.description}
          onChange={handleChange}
          aria-required="true"
          required
        />
        <Button
          buttonType="submit"
          className="logout-btn"
          text="Créer l'événement"
          onClick={null}
        />
      </form>
      <Dialog
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="confirm-dialog-title"
            >
              <DialogTitle id="confirm-dialog-title">
                Evénement crée avec succès
              </DialogTitle>
              <DialogContent>
                <p>Vous pouvez consulter tous les événements en cliquant sur le bouton voir</p>
              </DialogContent>
              <DialogActions>
                <Btton onClick={() => setOpen(false)}>Annuler</Btton>
                <Btton onClick={navigateTo} color="success" autoFocus>
                  Voir
                </Btton>
              </DialogActions>
            </Dialog>
    </main>
  );
};

export default CreateEvent;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Pour récupérer l'ID de l'événement et rediriger après mise à jour
import "../styles/pages/EditEvent.scss";

const EditEvent = () => {
  const { eventId } = useParams(); // récup ID de l'événement à modifier depuis l'URL
  const history = useNavigate(); // utilisé pour rediriger l'utilisateur après la mise à jour
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  }); // state pour stocker les données du formulaire de mise à jour

  // récup les détails de l'événement pour pré-remplir le formulaire
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/events/${eventId}`
        );
        setEventData(response.data); // Remplir les champs du formulaire avec les données de l'événement
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de l'événement :",
          error
        );
      }
    };

    fetchEventDetails();
  }, [eventId]); // se lance dès qu'on a l'ID de l'événement

  // Gère la soumission du formulaire de mise à jour
  const handleSubmit = async (e) => {
    e.preventDefault(); // empêche le rechargement de la page lors de la soumission du formulaire

    try {
      await axios.put(`http://localhost:5000/api/events/${eventId}`, eventData);
      alert("Événement mis à jour avec succès !");
      history.push("/"); // redirige vers la page d'accueil après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'événement :", error);
      alert("Erreur lors de la mise à jour de l'événement.");
    }
  };

  // Gère les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target; // récup le nom et la valeur du champ
    setEventData({
      ...eventData,
      [name]: value, // met à jour les données de l'événement
    });
  };

  return (
    <main className="edit-event">
      <h2>Modifier l'événement</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Lieu</label>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Mettre à jour l'événement</button>
      </form>
    </main>
  );
};

export default EditEvent;

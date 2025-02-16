import React from "react";
import "../styles/pages/Home.scss";

const Home = () => {
  const events = [
    {
      id: 1,
      title: "Randonnée dans les Alpes",
      date: "10 Février 2025",
      location: "Chamonix",
    },
    {
      id: 2,
      title: "Soirée Backpackers à Lisbonne",
      date: "15 Février 2025",
      location: "Lisbonne",
    },
    {
      id: 3,
      title: "Plongée en Thaïlande",
      date: "20 Février 2025",
      location: "Phuket",
    },
  ];

  return (
    <main className="home">
      <h2>Événements à venir</h2>
      <ul className="events-list">
        {events.map((event) => (
          <li key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p>
              <strong>Lieu :</strong> {event.location}
            </p>
            <p>
              <strong>Date :</strong> {event.date}
            </p>
            <button className="details-btn">En savoir +</button>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Home;

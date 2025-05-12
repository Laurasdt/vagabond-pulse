import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/profile.scss";

const Profile = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [memories, setMemories] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Veuillez sélectionner une image.");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      formData.append("userId", userId);

      const res = await axios.post(
        "http://localhost:5000/api/memories",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMemories((prev) => [res.data, ...prev]);
      setFile(null);
      setDescription("");
    } catch (err) {
      console.error("Erreur upload memory:", err);
      alert("Échec de l’envoi. Réessaie plus tard.");
    }
  };
  useEffect(() => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/memories/${userId}`)
      .then((res) => setMemories(res.data))
      .catch((err) => console.error("Erreur fetch memories:", err));
  }, [userId]);

  return (
    <main className="profile-page">
      <h1>Mon Profile</h1>

      <section className="memories-upload">
        <h2>Ajouter un souvenir</h2>
        <form className="memory-form" onSubmit={handleSubmit}>
          <label className="form-group">
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          <label className="form-group">
            <input
              type="text"
              placeholder="Petite description..."
              value={description}
              onChange={handleDescriptionChange}
            />
          </label>
          <button type="submit" className="btn">
            Envoyer
          </button>
        </form>
      </section>

      <section className="memories-gallery">
        <h2>Mes Souvenirs</h2>
        {memories.length === 0 ? (
          <p>Aucun souvenir pour l’instant.</p>
        ) : (
          <div className="gallery-grid">
            {memories.map((mem) => (
              <article key={mem.id} className="memory-item">
                <img
                  src={`http://localhost:5000${mem.photoUrl}`}
                  alt={mem.description}
                />
                <div className="memory-info">
                  <p>{mem.description}</p>
                  <small>{new Date(mem.createdAt).toLocaleString()}</small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;

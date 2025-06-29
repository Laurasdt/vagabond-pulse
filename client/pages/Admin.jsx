import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/Admin.scss";
import Title from "../components/Title";

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`);
      setUsers((u) => u.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const handleUpdate = async (id) => {
    const newRole = window.prompt("Nouveau rôle (user/admin) :", "user");
    if (!newRole) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        role: newRole,
      });
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  return (
    <main className="profile-page">
      <Title text="Tableau de bord administrateur"></Title>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>E-mail</th>
            <th>Pseudo</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.pseudo}</td>
              <td>{u.role}</td>
              <td>
                <button className="btn-edit" onClick={() => handleUpdate(u.id)}>
                  Éditer
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(u.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Admin;

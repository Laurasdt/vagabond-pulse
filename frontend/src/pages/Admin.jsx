import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/Admin.scss";
import Title from "../components/Title";
import Button from "../components/Button";
import { Toaster, toast } from "sonner";
import { TableContainer } from "@mui/material";

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    toast.success("authentification réussie");
    fetchUsers();
  }, [user, toast]);

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
      <Toaster></Toaster>
      <Title text="Tableau de bord administrateur"></Title>
<TableContainer></TableContainer>
      <table className="admin-table">
        
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.pseudo}</td>
              <td>{u.role}</td>
              <td>
                <Button
                  onClick={() => handleUpdate(u.id)}
                  className="btn-edit"
                  type="button"
                  text="Editer"
                ></Button>
                <Button
                  onClick={() => handleDelete(u.id)}
                  className="btn-delete"
                  type="button"
                  text="Supprimer"
                ></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Admin;

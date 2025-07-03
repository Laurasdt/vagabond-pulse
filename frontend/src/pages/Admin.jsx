import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/Admin.scss";
import Title from "../components/Title";
import Button from "../components/Button";
import { toast } from "sonner";
import { TableContainer } from "@mui/material";
import UsersTable from "../components/UsersTable";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as Btton,
} from "@mui/material";

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const handleShowConfirmation = (id) => {
    setConfirmOpen(true);
    setUserId(id);
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    // toast.success("authentification réussie");
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

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`);
      setUsers((u) => u.filter((user) => user.id !== userId));
      setConfirmOpen(false);
      toast.success("Utilisateur supprimé avec succès");
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
      {/* <Toaster></Toaster> */}
      <Title text="Tableau de bord administrateur"></Title>
      {/* <TableContainer></TableContainer> */}
      <UsersTable users={users} onDelete={handleShowConfirmation}></UsersTable>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Supprimer cet utilisateur ?
        </DialogTitle>
        <DialogContent>
          <p>
            Etes-vous sûr de vouloir supprimer definitivement cet utilisateur ?
          </p>
        </DialogContent>
        <DialogActions>
          <Btton onClick={() => setConfirmOpen(false)}>Annuler</Btton>
          <Btton onClick={handleDelete} color="error" autoFocus>
            Supprimer
          </Btton>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Admin;

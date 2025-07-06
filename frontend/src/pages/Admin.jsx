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
import { BACKEND_URI } from "../Constante/constante";

const Admin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const handleShowUpdateConfirmation = (id) => {
    setConfirmUpdateOpen(true);
    setUserToUpdate(id);
  }
  const handleUpdateUserRole = async () => {
    try {

      if (newRole!=="admin" && newRole!=="user") {
        toast.error('Vous devez choisir user ou admin.')
        setConfirmUpdateOpen(false);
        return;
      }
      await axios.put(BACKEND_URI + "/api/users/" + userToUpdate, {
        role: newRole
      })
      setConfirmUpdateOpen(false);
      fetchUsers();
toast.success('Utilisateur modifié avec succès !')
    } catch (error) {
      toast.error('Erreur lors de la modification de l\'utilisateur')
      console.log(error);
      
    }
  }
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
      <UsersTable users={users} onEdit={handleShowUpdateConfirmation} onDelete={handleShowConfirmation}></UsersTable>

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
      <Dialog
        open={confirmUpdateOpen}
        onClose={() => setConfirmUpdateOpen(false)}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Modifier le rôle d'un utilisateur
        </DialogTitle>
        <DialogContent>
          <p>
            Etes-vous sûr de vouloir modifier le rôle de cet utilisateur ?
          </p>
          <input className="update-input" type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Btton onClick={() => setConfirmUpdateOpen(false)}>Annuler</Btton>
          <Btton onClick={handleUpdateUserRole} color="info" autoFocus>
            Modifier
          </Btton>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Admin;

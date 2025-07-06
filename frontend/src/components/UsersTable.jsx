import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  Paper,
  Button,
  TableRow,
} from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

function UsersTable({ users, onDelete, onEdit }) {
  const headers = ["ID", "Email", "Pseudo", "Rôle", "Actions"];

  return (
    <TableContainer component={Paper} aria-label="UsersTable">
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index}>
                <Typography
                  variant="subtitle2"
                  component="span"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {header}
                </Typography>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="body2" color="text.secondary">
                  Aucun utilisateur trouvé
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.pseudo}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      textTransform: "capitalize",
                      color: user.role === "admin" ? "error.main" : "text.secondary",
                    }}
                  >
                    {user.role}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button 
                    onClick={() => onDelete(user.id)}
                    color="error"
                    variant="outlined"
                    size="small"
                  >
                    Supprimer
                  </Button>
                     <Button 
                    onClick={() => onEdit(user.id)}
                    color="succes"
                    variant="outlined"
                    size="small"
                  >
                    Modifier
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

UsersTable.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      email: PropTypes.string.isRequired,
      pseudo: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default UsersTable;
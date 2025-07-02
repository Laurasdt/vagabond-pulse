import { Table, TableBody, TableCell, TableContainer, TableHead, Typography, Button, TableRow} from '@mui/material'
import React from 'react'

function UsersTable({users, onDelete}) {
  return (
    <TableContainer component={Paper} aria-label={'UsersTable'}>
        <Table>
            <TableHead>
                {['id', 'email', 'pseudo', 'role', 'actions'].map((header) => (
                    <TableCell>
                        <Typography variant='subtitle2' component={'span'} sx={{fontWeight:'bold', color:'primary.main'}}>
                            {header}
                        </Typography>
                    </TableCell>
                ))}
            </TableHead>
            <TableBody> 
                {users.map(user => (
                    <TableRow key={user.id} hover>
<TableCell >{user.id}</TableCell>
<TableCell >{user.email}</TableCell>
<TableCell>{user.pseudo}</TableCell>
<TableCell>
    <Typography variant='body2'sx={{textTransform: 'capitalize', color:user.role==="admin" ? 'error.main':'text.secondary'}}>
        <TableCell><Button onClick={() => onDelete(user.id)}>Supprimer</Button></TableCell>
    </Typography>
</TableCell>
                    </TableRow>)
                )}
                {users.length===0 && (
                    <TableRow><TableCell colSpan={5} align='center'>
                        <Typography>Aucun utilisateur trouvé</Typography></TableCell></TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>
  )
}

export default UsersTable
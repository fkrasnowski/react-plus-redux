import { Users } from "./reducer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import { useMemo, useState } from "react";

const UserList = ({
  users,
  onEditUser,
  onDeleteUser,
}: {
  users: Users.User[];
  onEditUser: (user: Users.User) => unknown;
  onDeleteUser: (id: number) => unknown;
}): JSX.Element => {
  const [orderByUsername, setSortByUsername] = useState(
    false as "asc" | "desc" | false
  );

  const sortedUsers = useMemo(() => {
    if (orderByUsername === "asc") {
      return [...users].sort(
        (u1, u2) => u2.username?.localeCompare(u1.username!) || 1
      );
    } else if (orderByUsername === "desc") {
      return [...users].sort(
        (u1, u2) => u1.username?.localeCompare(u2.username!) || 1
      );
    } else {
      return users;
    }
  }, [users, orderByUsername]);

  return (
    <TableContainer>
      <Table aria-label="User table">
        <TableHead>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell sortDirection={orderByUsername}>
              Username
              <TableSortLabel
                active={!!orderByUsername}
                direction={orderByUsername || undefined}
                onClick={() =>
                  setSortByUsername(
                    (
                      {
                        asc: false,
                        desc: "asc",
                        false: "desc",
                      } as const
                    )[`${orderByUsername}`]
                  )
                }
              ></TableSortLabel>
            </TableCell>
            <TableCell align="right">City</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell component="th" scope="row">
                {user.id}
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.username || "•••"}</TableCell>
              <TableCell align="right">{user.address?.city || "•••"}</TableCell>
              <TableCell align="right">{user.email}</TableCell>
              <TableCell align="right">
                <Box sx={{ display: "grid", gridAutoFlow: "column", gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => onEditUser(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => onDeleteUser(user.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserList;

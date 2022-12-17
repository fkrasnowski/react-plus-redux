import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { Users } from "./reducer";
import UserList from "./UserList";
import LinearProgress from "@mui/material/LinearProgress";
import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import UserDialogForm from "./UserDialogForm";
import AddIcon from "@mui/icons-material/Add";

const UsersView = (): JSX.Element | null => {
  const users = useAppSelector((state) => state.users);

  const addUserForm = useAppSelector((state) => state.users.forms.addUser);
  const editUserForm = useAppSelector((state) => state.users.forms.editUser);
  const dispatch = useAppDispatch();

  const [currentEditId, setCurrentEditId] = useState(null as number | null);

  useEffect(() => {
    dispatch(Users.fetchUsers());
  }, []);

  if (users.fetchStatus === "error") return <p>Error while fetching data</p>;

  if (!users.list) {
    if (users.fetchStatus === "idle") return null;
    if (users.fetchStatus === "pending") return <LinearProgress />;
    return <p>Unexpected issue</p>;
  }

  return (
    <Paper sx={{ paddingBottom: "5rem" }}>
      <UserList
        users={users.list}
        onEditUser={(user) => {
          dispatch(Users.inputEditUserFormData(user));
          setCurrentEditId(user.id);
        }}
        onDeleteUser={(id) => dispatch(Users.submitDeleteUser(id))}
      />
      <Fab
        aria-label="add"
        color="primary"
        variant="extended"
        sx={{ position: "fixed", bottom: 10, right: 10 }}
        onClick={() => dispatch(Users.showAddUserForm())}
      >
        <AddIcon />
        Add User
      </Fab>
      <UserDialogForm
        open={addUserForm.show}
        title="Add New User"
        form={addUserForm}
        onInput={(data) => dispatch(Users.inputAddUserFormData(data))}
        onCancel={() => dispatch(Users.hideAddUserForm())}
        onSubmit={() => {
          dispatch(Users.submitAddUser());
        }}
      />
      <UserDialogForm
        open={editUserForm.show}
        title="Edit User"
        form={editUserForm}
        onInput={(data) => dispatch(Users.inputEditUserFormData(data))}
        onCancel={() => dispatch(Users.hideEditUserForm())}
        onSubmit={() => {
          dispatch(Users.submitEditUser(currentEditId!));
        }}
      />
    </Paper>
  );
};

export default UsersView;

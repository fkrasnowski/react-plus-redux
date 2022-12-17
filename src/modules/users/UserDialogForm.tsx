import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

import { Users } from "./reducer";

const UserDialogForm = ({
  open,
  title,
  form,
  onCancel,
  onSubmit,
  onInput,
}: {
  open: boolean;
  title: string;
  form: Users.UserForm;
  onInput: (data: Users.UserForm["data"]) => void;
  onCancel: () => void;
  onSubmit: () => void;
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          type="name"
          fullWidth
          variant="standard"
          value={form.data.name}
          error={form.validation.name === "invalid"}
          onChange={(e) => onInput({ ...form.data, name: e.target.value })}
        />
        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
          value={form.data.email}
          error={form.validation.email === "invalid"}
          onChange={(e) => onInput({ ...form.data, email: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDialogForm;

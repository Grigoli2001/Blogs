import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createAdmin } from "../../api/auth";
import { useEffect, useRef, useState } from "react";

import { QueryClient } from "@tanstack/react-query";

export default function AdminDialog({
  open,
  onClose,
  queryClient,
  setMessage: setSnackMessage,
  setAddAdminDialogOpen,
}: {
  open: boolean;
  onClose: () => void;
  queryClient: QueryClient;
  setMessage: (message: string) => void;
  setAddAdminDialogOpen: (open: boolean) => void;
}) {
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  // const [nameErrorMessage, setNameErrorMessage] = useState("");
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const handleAddAdmin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newAdmin.password !== newAdmin.confirmPassword) {
      setPasswordErrorMessage("Passwords do not match");
      setSnackMessage("Passwords do not match");
      return;
    }
    addAdminMutate(newAdmin);
  };

  useEffect(() => {
    if (newAdmin.password === newAdmin.confirmPassword) {
      setPasswordErrorMessage("");
    }
  }, [newAdmin.password, newAdmin.confirmPassword]);

  const { mutate: addAdminMutate, isPending } = useMutation({
    mutationFn: (newAdminData: {
      name: string;
      email: string;
      password: string;
    }) =>
      createAdmin(newAdminData.email, newAdminData.password, newAdminData.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
      setSnackMessage("Succesfully changed status");
      setAddAdminDialogOpen(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      if (error.response.data.error === "Email already exists") {
        setEmailErrorMessage("Email already exists");
      }
      setSnackMessage(error.response.data.error);
    },
  });
  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAddAdmin} sx={{ mt: 2 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                required
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, name: e.target.value })
                }
                autoComplete="off"
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                required
                type="email"
                value={newAdmin.email}
                onChange={(e) => {
                  setEmailErrorMessage("");
                  setNewAdmin({ ...newAdmin, email: e.target.value });
                }}
                autoComplete="off"
                helperText={
                  emailErrorMessage ? (
                    <span style={{ color: "red" }}>{emailErrorMessage}</span>
                  ) : null
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: emailErrorMessage && "red", // This will make the border red
                    },

                    "&:hover fieldset": {
                      borderColor: emailErrorMessage && "red", //This will make the border red on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: emailErrorMessage && "red", //This will make the border red on focus
                    },
                  },
                }}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                required
                type="password"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: passwordErrorMessage && "red", // This will make the border red
                    },

                    "&:hover fieldset": {
                      borderColor: passwordErrorMessage && "red", //This will make the border red on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: passwordErrorMessage && "red", //This will make the border red on focus
                    },
                  },
                }}
                autoComplete="off"
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                required
                type="password"
                value={newAdmin.confirmPassword}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, confirmPassword: e.target.value })
                }
                inputRef={confirmPasswordRef}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: passwordErrorMessage && "red", // This will make the border red
                    },

                    "&:hover fieldset": {
                      borderColor: passwordErrorMessage && "red", //This will make the border red on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: passwordErrorMessage && "red", //This will make the border red on focus
                    },
                  },
                }}
                autoComplete="off"
              />
            </Box>
            <DialogActions sx={{ mt: 3 }}>
              <Button onClick={onClose} color="primary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {isPending ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Add"
                )}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

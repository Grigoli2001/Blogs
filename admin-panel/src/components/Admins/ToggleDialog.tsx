import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { toggleAdminStatus } from "../../api/admin";
import { useMutation, QueryClient } from "@tanstack/react-query";

interface ToggleDialogProps {
  dialogOpen: boolean;
  handleDialogClose: () => void;
  queryClient: QueryClient; // You might want to replace 'any' with the actual type
  setMessage: (message: string) => void;
  selectedAdmin: { id: string; status: string | null } | null;
}

export default function ToggleDialog({
  dialogOpen,
  handleDialogClose,
  queryClient,
  setMessage,
  selectedAdmin,
}: ToggleDialogProps) {
  const { mutate: toggleMutate, isPending } = useMutation({
    mutationFn: ({
      adminId,
      status,
    }: {
      adminId: string;
      status: string | null;
    }) => toggleAdminStatus(adminId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setMessage(error.response.data.error);
    },
  });
  const handleToggleStatus = () => {
    if (selectedAdmin) {
      toggleMutate({
        adminId: selectedAdmin.id,
        status: null,
      });
    }
    handleDialogClose();
  };
  return (
    <>
      <div>
        <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          disableEnforceFocus
          disableRestoreFocus
        >
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to{" "}
              {selectedAdmin?.status === "active" ? "deactivate" : "activate"}{" "}
              this admin?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleToggleStatus} color="secondary">
              {isPending ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

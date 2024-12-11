import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdmins } from "../api/admin";
import { Container, Button, Typography, Snackbar, Box } from "@mui/material";
import AdminDataTable from "../components/Admins/AdminDataTable";
import AdminDialog from "../components/Admins/AdminDialog";
import ToggleDialog from "../components/Admins/ToggleDialog";

const AdminListPage = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [addAdminDialogOpen, setAddAdminDialogOpen] = React.useState(false);
  const [selectedAdmin, setSelectedAdmin] = React.useState<{
    id: string;
    status: string | null;
  } | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const { data: admins, isLoading } = useQuery({
    queryKey: ["admins"],
    queryFn: getAdmins,
  });

  const handleDialogOpen = (adminId: string, status: string | null) => {
    setSelectedAdmin({ id: adminId, status });
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAdmin(null);
  };
  const handleAddAdminOpen = () => {
    setAddAdminDialogOpen(true);
  };

  const handleAddAdminClose = () => {
    setAddAdminDialogOpen(false);
  };

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Admins</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddAdminOpen}
        >
          Add Admin
        </Button>
      </Box>

      {/* Data Table usign DataGrid */}
      <AdminDataTable
        admins={Array.isArray(admins) ? admins : []}
        handleDialogOpen={handleDialogOpen}
        isLoading={isLoading}
      />

      {/* Confirmation Dialog for Status change*/}
      <ToggleDialog
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
        queryClient={queryClient}
        setMessage={setMessage}
        selectedAdmin={selectedAdmin}
      />

      {/* Add Admin Dialog */}
      <AdminDialog
        open={addAdminDialogOpen}
        onClose={handleAddAdminClose}
        setMessage={setMessage}
        setAddAdminDialogOpen={setAddAdminDialogOpen}
        queryClient={queryClient}
      />

      {/* Success or error but hopefully success Snackbar  */}
      <Snackbar
        open={!!message}
        autoHideDuration={3000}
        onClose={() => setMessage(null)}
        message={message}
      />
    </Container>
  );
};

export default AdminListPage;

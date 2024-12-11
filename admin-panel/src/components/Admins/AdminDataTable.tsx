import { Button } from "@mui/material";
import { GridRowsProp, GridColDef, DataGrid } from "@mui/x-data-grid";
import { Admin } from "../../types/admin.types";

interface DataTableProps {
  admins: Admin[];
  handleDialogOpen: (id: string, status: string) => void;
  isLoading: boolean;
}

export default function AdminDataTable({
  admins,
  handleDialogOpen,
  isLoading,
}: DataTableProps) {
  const rows: GridRowsProp = Array.isArray(admins)
    ? admins.map((admin: Admin) => ({
        id: admin._id,
        name: admin.name,
        email: admin.email,
        status: admin.status,
        createdAt: admin.created_at ? new Date(admin.created_at) : null,
      }))
    : [];
  const columns: GridColDef[] = [
    // { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "status", headerName: "Status", width: 150 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 300,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      filterable: false,
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() =>
            handleDialogOpen(params.row.id as string, params.row.status)
          }
          variant="contained"
          fullWidth
          color={params.row.status == "active" ? "secondary" : "primary"}
        >
          {params.row.status == "active" ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ];
  return (
    <div>
      <DataGrid
        sx={{ minHeight: 600 }}
        pagination
        rows={rows}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
        }}
        pageSizeOptions={[10, 15, 25]}
        loading={isLoading}
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
        }}
      />
    </div>
  );
}

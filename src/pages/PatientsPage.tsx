import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import GenericGrid from "../components/common/GenericGrid";
import PatientForm from "../features/patients/components/PatientForm";
import { formatDate } from "../utils/dateHelper";
import { usePatients } from "../features/patients/hooks/usePatients";
import { Patient } from "../features/patients/types";
import { useAppNavigation } from "../hooks/useAppNavigation";

const PatientsPage: React.FC = () => {
  // local state for filtering, pagination, and dialog control
  const [filters, setFilters] = useState({ name: "", phone: "" });
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { toPatientDetails } = useAppNavigation();

  // use our custom hook to fetch patients based on filters and pagination
  const { patients, totalPatients, loading, error, addNewPatient } =
    usePatients(filters, page, pageSize);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0); // reset back to first page on filter change
  };

  const handlePaginationChange = (paginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPage(paginationModel.page);
    setPageSize(paginationModel.pageSize);
  };

  // For deletion, you would normally call an API
  const handleDeletePatient = (id: string) => {
    // This is just a placeholder. In a real scenario, call the delete API and refresh the list.
    console.log("Delete patient", id);
  };

  const handleEditPatient = (id: string) => {
    toPatientDetails(id);
  };

  const handleAddPatient = async (values: Omit<Patient, "id">) => {
    await addNewPatient(values);
    setOpenDialog(false);
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }: { row: Patient }) => (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, height: "100%" }}
        >
          <PersonIcon />
          <Typography variant="body2">{row.name}</Typography>
        </Box>
      ),
    },
    { field: "birth", headerName: "Birth", flex: 1, minWidth: 100 },
    { field: "age", headerName: "Age", flex: 1, minWidth: 100 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 150,
      renderCell: ({ row }: { row: Patient }) => (
        <>
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={() => handleEditPatient(row.id)}
          >
            <EditIcon />
          </Button>
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={() => handleDeletePatient(row.id)}
          >
            <DeleteIcon />
          </Button>
        </>
      ),
    },
  ];

  const rows = patients.map((patient) => ({
    id: patient.id,
    name: patient.name,
    birth: formatDate(new Date(patient.birth)),
    age: patient.age,
    phone: patient.phone,
  }));

  const stats = [
    { label: "Total Patients", value: totalPatients },
    { label: "New This Month", value: "28" },
    { label: "Active Patients", value: "156" },
  ];

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f5f7fb" }}>
      {/* Improved header section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            sx={{
              fontSize: "12px",
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Dashboard / <Typography color="primary">Patients</Typography>
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Patient Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            Add Patient
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat) => (
            <Grid item xs={12} md={4} key={stat.label}>
              <Card
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "background.paper",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  borderRadius: 2,
                }}
              >
                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ mb: 1 }}
                >
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {stat.value}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Improved search filters */}
      <Card
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <TextField
              label="Search by Name"
              variant="outlined"
              fullWidth
              size="small"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "background.paper",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <TextField
              label="Search by Phone"
              variant="outlined"
              fullWidth
              size="small"
              value={filters.phone}
              onChange={(e) => handleFilterChange("phone", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "background.paper",
                },
              }}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Improved table card */}
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          "& .MuiDataGrid-root": {
            border: "none",
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f0f0f0",
            },
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: "#f8fafc",
              borderBottom: "1px solid #e0e0e0",
            },
          },
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress size={40} />
            <Typography sx={{ ml: 2 }} color="text.secondary">
              Loading patients...
            </Typography>
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
              color: "error.main",
            }}
          >
            <Typography variant="body1">{error}</Typography>
          </Box>
        ) : (
          <GenericGrid
            rows={rows}
            columns={columns}
            gridProps={{
              paginationModel: { page, pageSize },
              onPaginationModelChange: handlePaginationChange,
              rowCount: totalPatients,
              paginationMode: "server",
              disableColumnMenu: true,
              autoHeight: true,
            }}
          />
        )}
      </Card>

      {/* Improved dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            borderBottom: "1px solid #f0f0f0",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          Add New Patient
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <PatientForm
            onSubmit={handleAddPatient}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default PatientsPage;

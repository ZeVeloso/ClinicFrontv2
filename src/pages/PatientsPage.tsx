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
import { useNavigate } from "react-router-dom";
import GenericGrid from "../components/common/GenericGrid";
import PatientForm from "../features/patients/components/PatientForm";
import { formatDate } from "../utils/dateHelper";
import { usePatients } from "../features/patients/hooks/usePatients";
import { Patient } from "../features/patients/types";

const PatientsPage: React.FC = () => {
  // local state for filtering, pagination, and dialog control
  const [filters, setFilters] = useState({ name: "", phone: "" });
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const navigate = useNavigate();

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
    navigate(`/patients/${id}`);
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

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Patient Management</Typography>
      </Box>

      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5.5}>
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
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={5.5}>
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
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Add Patient
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Card sx={{ p: 2, overflowX: "auto", whiteSpace: "nowrap" }}>
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto" }} />
        ) : error ? (
          <Typography variant="body1" color="error" textAlign="center">
            {error}
          </Typography>
        ) : (
          <GenericGrid
            rows={rows}
            columns={columns}
            gridProps={{
              paginationModel: { page, pageSize },
              onPaginationModelChange: handlePaginationChange,
              rowCount: totalPatients,
              paginationMode: "server",
            }}
          />
        )}
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Patient</DialogTitle>
        <DialogContent>
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

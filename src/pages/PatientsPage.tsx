import React, { useState, useEffect, useCallback } from "react";
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
import Grid from "@mui/material/Grid2";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from "react-router-dom";
import GenericGrid from "../components/GenericGrid";
import PatientForm from "../components/PatientForm";
import { getPatients, addPatient } from "../api/patients";
import { calculateAge } from "../utils/calculateAge";
import { formatDate } from "../utils/dateHelper";
import { debounce } from "lodash";
import { Patient } from "../types/Patient";

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const [filters, setFilters] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch patients from API with filters
  const fetchPatients = useCallback(
    debounce(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPatients({
          name: filters.name,
          phone: filters.phone,
          page: page + 1,
          pageSize,
        });
        const updatedPatients = response.data.map((patient: Patient) => ({
          ...patient,
          age: calculateAge(patient.birth),
        }));
        setPatients(updatedPatients);
        setTotalPatients(response.total);
      } catch (err) {
        setError("Failed to fetch patients. Please try again later.");
      } finally {
        setLoading(false);
      }
    }, 500),
    [filters, page, pageSize]
  );

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(0); // Reset to first page on filter change
  };

  const handlePaginationChange = (paginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPage(paginationModel.page);
    setPageSize(paginationModel.pageSize);
  };

  const handleDeletePatient = (id: string) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  };

  const handleEditPatient = (id: string) => {
    navigate(`/patients/${id}`);
  };

  const handleAddPatient = async (values: {
    name: string;
    birth: string;
    phone: string;
    gender: string;
    address: string;
    job: string;
  }) => {
    try {
      const newPatient = await addPatient({
        name: values.name,
        birth: values.birth,
        phone: values.phone,
        gender: values.gender,
        address: values.address,
        job: values.job,
      });
      const age = calculateAge(newPatient.data.birth);
      setPatients((prev) => [...prev, { ...newPatient.data, age }]);
      setOpenDialog(false);
    } catch (err) {
      setError("Failed to add patient. Please try again.");
    }
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
          <Grid size={{ xs: 12, md: 5.5 }}>
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
          <Grid size={{ xs: 12, md: 5.5 }}>
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
          <Grid size={{ xs: 12, md: 1 }}>
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

      <Card
        sx={{
          p: 2,
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
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

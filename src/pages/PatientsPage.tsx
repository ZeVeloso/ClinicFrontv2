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

import { Patient } from "../types/Patient";

const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch patients from API
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPatients();
      const updatedPatients = response.data.map((patient: Patient) => ({
        ...patient,
        age: calculateAge(patient.birth),
      }));
      setPatients(updatedPatients);
      setFilteredPatients(updatedPatients);
    } catch (err) {
      setError("Failed to fetch patients. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPatients(
      patients.filter((patient) => patient.name.toLowerCase().includes(query))
    );
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
        phone: parseInt(values.phone),
        gender: values.gender,
        address: values.address,
        job: values.job,
      });
      const age = calculateAge(newPatient.birthDate);
      setPatients((prev) => [...prev, { ...newPatient, age }]);
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
    {
      field: "birth",
      headerName: "Birth",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "age",
      headerName: "Age",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 150,
    },
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

  const rows = filteredPatients.map((patient) => ({
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Patient
        </Button>
      </Box>

      <Card sx={{ mb: 4, p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 3 }}>
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Search by Phone"
            variant="outlined"
            fullWidth
            size="small"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
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
          <GenericGrid rows={rows} columns={columns} />
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

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Edit, Delete } from "@mui/icons-material";
import GenericGrid from "../components/GenericGrid";
import { getPatients } from "../api/patients";

type Patient = {
  id: number;
  name: string;
  age: number;
  phone: string;
};

const PatientsPage = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await getPatients(); // Assuming getPatients returns { data: Patient[] }
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (err) {
      setError("Failed to fetch patients. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredPatients(
      patients.filter((patient) => patient.name.toLowerCase().includes(query))
    );
  };

  const handleRowAction = (id: number, action: string) => {
    if (action === "manage") {
      console.log(`Manage patient with ID: ${id}`);
    } else if (action === "delete") {
      console.log(`Delete patient with ID: ${id}`);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "age", headerName: "Age", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params: any) => (
        <>
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={() => handleRowAction(params.row.id, "manage")}
          >
            <Edit />
          </Button>
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={() => handleRowAction(params.row.id, "delete")}
          >
            <Delete />
          </Button>
        </>
      ),
    },
  ];

  const rows = filteredPatients.map((patient) => ({
    id: patient.id,
    name: patient.name,
    age: patient.age,
    phone: patient.phone,
  }));

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="h4">Patient Management</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Add Patient
        </Button>
      </Box>

      {/* Filters Card */}
      <Card sx={{ marginBottom: 4, padding: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
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
            label="Phone Number"
            variant="outlined"
            fullWidth
            size="small"
          />
        </Box>
      </Card>

      {/* Patient Grid in Card */}
      <Card sx={{ padding: 2 }}>
        {loading ? (
          <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
        ) : error ? (
          <Typography
            variant="body1"
            color="error"
            sx={{ textAlign: "center" }}
          >
            {error}
          </Typography>
        ) : (
          <GenericGrid rows={rows} columns={columns} />
        )}
      </Card>
    </Box>
  );
};

export default PatientsPage;

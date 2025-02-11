import React, { useState, useEffect } from "react";
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
import InputAdornment from "@mui/material/InputAdornment";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import GenericGrid from "../components/common/GenericGrid";
import AppointmentForm from "../features/appointments/components/AppointmentForm";
import { formatDateTime } from "../utils/dateHelper";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  useAppointments,
  AppointmentFilters,
} from "../features/appointments/hooks/useAppointments";

const AppointmentsPage: React.FC = () => {
  // Local state for filters, pagination, and dialog control
  const [filters, setFilters] = useState<AppointmentFilters>({
    patient: "",
    phone: "",
    date: "",
    status: "",
  });
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // Using debouncedFilters to avoid rapid re-fetching when typing
  const [debouncedFilters, setDebouncedFilters] =
    useState<AppointmentFilters>(filters);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(0); // reset to first page when filters change
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [filters]);

  const {
    appointments,
    totalAppointments,
    loading,
    error,
    addAppointment,
    editAppointment,
    toggleAppointmentStatus,
    cancelAppointment,
  } = useAppointments(debouncedFilters, page, pageSize);

  // Update pagination states
  const handlePaginationChange = (paginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPage(paginationModel.page);
    setPageSize(paginationModel.pageSize);
  };

  // Handle filter changes
  const handleFilterChange = (
    field: keyof AppointmentFilters,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Handler for creating a new appointment, then refreshing the list
  const handleAddAppointment = async (appointmentData: any) => {
    await addAppointment(appointmentData);
    setOpenDialog(false);
  };

  // Map appointments to the grid rows
  const rows = appointments.map((appt) => ({
    id: appt.id,
    date: formatDateTime(new Date(appt.date)),
    patient: appt.patient?.name,
    phone: appt.patient?.phone,
    status: appt.status,
    motive: appt.motive,
  }));

  // Define grid columns
  const columns = [
    { field: "date", headerName: "Date", flex: 1, minWidth: 100 },
    { field: "patient", headerName: "Patient", flex: 1, minWidth: 120 },
    { field: "phone", headerName: "Phone", flex: 1, minWidth: 120 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.2,
      minWidth: 50,
      renderCell: ({ row }: { row: { status: string } }) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {row.status === "D" ? (
            <CheckIcon color="success" />
          ) : row.status === "N" ? (
            <ScheduleIcon color="info" />
          ) : row.status === "C" ? (
            <CancelIcon color="error" />
          ) : null}
        </Box>
      ),
    },
    { field: "motive", headerName: "Motive", flex: 1, minWidth: 150 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 200,
      renderCell: ({ row }: { row: any }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="text"
            color="primary"
            size="small"
            onClick={() => editAppointment(row)}
          >
            <EditIcon />
          </Button>
          <Button
            variant="text"
            color="secondary"
            size="small"
            onClick={() => toggleAppointmentStatus(row.id)}
          >
            <CheckIcon />
          </Button>
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={() => cancelAppointment(row.id)}
          >
            <CancelIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f9f9f9" }}>
      {/* Header with title and add button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Appointments</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add
        </Button>
      </Box>

      {/* Filter inputs */}
      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search by Patient"
              variant="outlined"
              fullWidth
              size="small"
              value={filters.patient}
              onChange={(e) => handleFilterChange("patient", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <TextField
              label="Date"
              variant="outlined"
              fullWidth
              size="small"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
            />
          </Grid>
        </Grid>
      </Card>

      {/* Appointments grid */}
      <Card sx={{ p: 2, overflowX: "auto", whiteSpace: "nowrap" }}>
        {loading ? (
          <CircularProgress sx={{ display: "block", mx: "auto", my: 2 }} />
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
              rowCount: totalAppointments,
              paginationMode: "server",
            }}
          />
        )}
      </Card>

      {/* Dialog for adding/editing an appointment */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        {/* <DialogTitle>Add Appointment</DialogTitle> */}
        <DialogContent>
          <AppointmentForm
            onSubmit={handleAddAppointment}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AppointmentsPage;

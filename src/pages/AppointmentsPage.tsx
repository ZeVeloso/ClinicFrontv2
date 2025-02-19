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
  InputAdornment,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import GenericGrid from "../components/common/GenericGrid";
import { formatDateTime } from "../utils/dateHelper";
import AppointmentForm from "../features/appointments/components/AppointmentForm";
import {
  useAppointments,
  AppointmentFilters,
} from "../features/appointments/hooks/useAppointments";
import { updateAppointment } from "../api/appointments";
import { useToast } from "../contexts/ToastContext";

const AppointmentsPage: React.FC = () => {
  // Filter and pagination state
  const [filters, setFilters] = useState<AppointmentFilters>({
    patient: "",
    phone: "",
    date: "",
    status: "",
  });
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(20);

  // Local states to control the appointment dialog popup
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);

  // Debounce filter changes to avoid fetching on every keystroke
  const [debouncedFilters, setDebouncedFilters] =
    useState<AppointmentFilters>(filters);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [filters]);

  const { showToast } = useToast();

  const {
    appointments,
    totalAppointments,
    loading,
    error,
    addAppointment,
    toggleAppointmentStatus,
    cancelAppointment,
    refreshAppointments,
  } = useAppointments(debouncedFilters, page, pageSize);

  const handlePaginationChange = (paginationModel: {
    page: number;
    pageSize: number;
  }) => {
    setPage(paginationModel.page);
    setPageSize(paginationModel.pageSize);
  };

  const handleFilterChange = (
    field: keyof AppointmentFilters,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Use updateAppointment directly for editing; addAppointment is used for new appointments.
  const handleSaveAppointment = async (values: any) => {
    try {
      if (values.id) {
        await updateAppointment(values.id, values);
        showToast("Appointment updated successfully", "success");
      } else {
        // Supply a patientId as needed; for example, if appointments are tied to a patient
        await addAppointment({ ...values, patientId: "" });
        showToast("Appointment created successfully", "success");
      }
      setOpenDialog(false);
      refreshAppointments();
    } catch (error) {
      console.error("Error saving appointment", error);
      showToast("Error saving appointment", "error");
    }
  };

  const handleOpenEditDialog = (appointment: any) => {
    setCurrentAppointment(appointment);
    setOpenDialog(true);
  };

  // Map appointments to grid rows; include the full appointment data for editing
  const rows = appointments.map((appt) => ({
    id: appt.id,
    date: formatDateTime(new Date(appt.date)),
    patient: appt.patient?.name,
    phone: appt.patient?.phone,
    status: appt.status,
    motive: appt.motive,
    fullData: appt,
  }));

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
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
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
            onClick={() => handleOpenEditDialog(row.fullData)}
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
      {/* Header with title and Add button */}
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
          onClick={() => {
            setCurrentAppointment(null);
            setOpenDialog(true);
          }}
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

      {/* Dialog popup for AppointmentForm */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentAppointment ? "Edit Appointment" : "Schedule Appointment"}
        </DialogTitle>
        <DialogContent>
          <AppointmentForm
            initialValues={currentAppointment || {}}
            onSubmit={handleSaveAppointment}
            onCancel={() => setOpenDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AppointmentsPage;

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
  Chip,
  Tooltip,
  MenuItem,
  DialogActions,
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
import { useAppNavigation } from "../hooks/useAppNavigation";

const AppointmentsPage: React.FC = () => {
  const { toAppointmentDetails } = useAppNavigation();
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
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    appointmentId: string | null;
    action: 'cancel' | 'complete' | null;
  }>({ open: false, appointmentId: null, action: null });

  const {
    appointments,
    totalAppointments,
    loading,
    error,
    addAppointment,
    refreshAppointments,
    handleStatusAction,
    actionLoading,
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
    toAppointmentDetails(appointment.id);
    //navigate(`/appointments/${appointment.id}`);
    //setOpenDialog(true);
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
      flex: 0.5,
      minWidth: 100,
      renderCell: ({ row }: { row: { status: string } }) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Chip
            label={
              row.status === "D" ? "Done" :
              row.status === "N" ? "Scheduled" :
              row.status === "C" ? "Cancelled" : "Unknown"
            }
            color={
              row.status === "D" ? "success" :
              row.status === "N" ? "primary" :
              row.status === "C" ? "error" : "default"
            }
            size="small"
            icon={
              row.status === "D" ? <CheckIcon /> :
              row.status === "N" ? <ScheduleIcon /> :
              row.status === "C" ? <CancelIcon /> : undefined
            }
          />
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
          <Tooltip title="Edit appointment">
            <Button
          
              color="primary"
              size="small"
              onClick={() => handleOpenEditDialog(row.fullData)}
              aria-label="Edit appointment"
            >
              <EditIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Mark as complete">
            <span>
              <Button
            
                color="success"
                size="small"
                onClick={() => setConfirmDialog({
                  open: true,
                  appointmentId: row.id,
                  action: 'complete'
                })}
                disabled={row.status === 'D' || actionLoading[row.id]}
                aria-label="Mark appointment as complete"
              >
                {actionLoading[row.id] ? (
                  <CircularProgress size={20} />
                ) : (
                  <CheckIcon />
                )}
              </Button>
            </span>
          </Tooltip>
          <Tooltip title="Cancel appointment">
            <span>
              <Button
              
                color="error"
                size="small"
                onClick={() => setConfirmDialog({
                  open: true,
                  appointmentId: row.id,
                  action: 'cancel'
                })}
                disabled={row.status === 'C' || actionLoading[row.id]}
                aria-label="Cancel appointment"
              >
                {actionLoading[row.id] ? (
                  <CircularProgress size={20} />
                ) : (
                  <CancelIcon />
                )}
              </Button>
            </span>
          </Tooltip>
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
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Status"
              variant="outlined"
              fullWidth
              size="small"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="N">Scheduled</MenuItem>
              <MenuItem value="D">Completed</MenuItem>
              <MenuItem value="C">Cancelled</MenuItem>
            </TextField>
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
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, appointmentId: null, action: null })}
      >
        <DialogTitle>
          {confirmDialog.action === 'cancel' ? 'Cancel Appointment' : 'Complete Appointment'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {confirmDialog.action === 'cancel' ? 'cancel' : 'mark as complete'} this appointment?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, appointmentId: null, action: null })}
            color="inherit"
          >
            No, Keep it
          </Button>
          <Button
            onClick={() => confirmDialog.appointmentId && handleStatusAction(
              confirmDialog.appointmentId,
              confirmDialog.action!,
              () => setConfirmDialog({ open: false, appointmentId: null, action: null })
            )}
            color={confirmDialog.action === 'cancel' ? 'error' : 'success'}
            variant="contained"
            autoFocus
          >
            Yes, {confirmDialog.action === 'cancel' ? 'Cancel' : 'Complete'} it
          </Button>
        </DialogActions>
      </Dialog>
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

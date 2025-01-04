import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAppointments } from "../api/appointments";

// Utilities for formatting dates
const formatDate = (date: Date) => moment(date).format("Do MMMM YYYY");
const formatTime = (date: Date) => moment(date).format("h:mm A");

// Component to display next appointment details
function NextAppointmentCard({ appointment, loading, error }: any) {
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    );
  }

  if (!appointment) {
    return <Typography variant="body1">No upcoming appointments.</Typography>;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Next Appointment
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" color="textSecondary">
            <strong>Title:</strong>
          </Typography>
          <Typography variant="body1">{appointment.title}</Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" color="textSecondary">
            <strong>Date:</strong>
          </Typography>
          <Typography variant="body1">
            {formatDate(appointment.start)}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" color="textSecondary">
            <strong>Time:</strong>
          </Typography>
          <Typography variant="body1">
            {formatTime(appointment.start)}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body1" color="textSecondary">
            <strong>Details:</strong>
          </Typography>
          <Typography variant="body1">
            {appointment.details || "No details provided"}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}

// Component for the calendar view
function CalendarView({ events, loading, error }: any) {
  const localizer = momentLocalizer(moment);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: "100%", width: "100%" }}
    />
  );
}

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [nextAppointment, setNextAppointment] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAppointments();
        // Map appointments to calendar events
        const calendarEvents = data.map((appointment: any) => ({
          id: appointment.id,
          title: appointment.patient.name,
          start: new Date(appointment.date),
          end: new Date(appointment.date),
          details: appointment.obs,
        }));

        setEvents(calendarEvents);

        // Find the next appointment
        const upcoming = calendarEvents.filter(
          (event) => event.start > new Date()
        );
        upcoming.sort((a, b) => a.start.getTime() - b.start.getTime());
        setNextAppointment(upcoming[0] || null);
      } catch (err) {
        setError("Error fetching appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <NextAppointmentCard
                appointment={nextAppointment}
                loading={loading}
                error={error}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={4}>
        <Card>
          <CardContent>
            <Box
              sx={{
                height: 500,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CalendarView events={events} loading={loading} error={error} />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

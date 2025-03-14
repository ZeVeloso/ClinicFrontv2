import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Scheduler } from "@aldabil/react-scheduler";

import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getAppointments } from "../api/appointments";
import { AccessTime, Event, Person } from "@mui/icons-material";

// Utilities for formatting dates
const formatDate = (date: Date) => moment(date).format("Do MMMM YYYY");
const formatTime = (date: Date) => moment(date).format("h:mm A");

// Component to display next appointment details
function NextAppointmentCard({ appointment, loading, error }: any) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!appointment) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "#f8fafc",
          borderRadius: 2,
        }}
      >
        <Event sx={{ fontSize: 40, color: "text.secondary", mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          No upcoming appointments
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          pb: 2,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <Event sx={{ color: "primary.main", mr: 1 }} />
        <Typography variant="h6">Next Appointment</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <Person sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Patient
              </Typography>
              <Typography variant="h6">{appointment.title}</Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
            <AccessTime sx={{ color: "text.secondary", mr: 1, mt: 0.5 }} />
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Date & Time
              </Typography>
              <Typography variant="h6">
                {formatDate(appointment.start)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatTime(appointment.start)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {appointment.details && (
          <Grid item xs={12}>
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "#f8fafc",
                borderRadius: 1,
                border: "1px solid #e0e7ff",
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Details
              </Typography>
              <Typography variant="body1">{appointment.details}</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  details?: string;
}

function CalendarView({ events, loading, error }: any) {
  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Scheduler
      view="month"
      events={events.map((event: CalendarEvent) => ({
        event_id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
      }))}
      loading={loading}
      week={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 1,
        startHour: 7,
        endHour: 21,
        step: 60,
      }}
      month={{
        weekDays: [0, 1, 2, 3, 4, 5, 6],
        weekStartOn: 1,
        startHour: 7,
        endHour: 21,
      }}
      onEventClick={(event: any) => console.log(event)}
      customViewer={(event: any) => (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">{event.title}</Typography>
          <Typography variant="body2">
            {moment(event.start).format("MMMM Do YYYY, H:mm a")}
          </Typography>
        </Box>
      )}
    />
  );
}
/*
// Component for the calendar view
function CalendarView({ events, loading, error }: any) {
  const localizer = momentLocalizer(moment);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%' 
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%' 
      }}>
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const calendarStyle = {
    height: "100%",
    width: "100%",
    '.rbc-header': {
      padding: '8px',
      backgroundColor: '#f8fafc',
      fontWeight: 600,
    },
    '.rbc-event': {
      backgroundColor: '#3f51b5',
      borderRadius: '4px',
    },
    '.rbc-today': {
      backgroundColor: '#f0f7ff',
    }
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={calendarStyle}
    />
  );
}
*/
export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [nextAppointment, setNextAppointment] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAppointments({
          patient: "",
          phone: "",
          date: "",
          status: "",
          page: 1,
          pageSize: 20,
        });
        // Map appointments to calendar events
        const calendarEvents = data.data.map((appointment: any) => ({
          id: appointment.id,
          title: appointment.patient ? appointment.patient.name : "New Patient",
          start: new Date(appointment.date),
          end: new Date(appointment.date),
          details: appointment.obs,
        }));

        setEvents(calendarEvents);

        // Find the next appointment
        const upcoming = calendarEvents.filter(
          (event: any) => event.start > new Date()
        );
        upcoming.sort(
          (a: any, b: any) => a.start.getTime() - b.start.getTime()
        );
        setNextAppointment(upcoming[0] || null);
      } catch (err) {
        setError("Error fetching appointments");
        console.error("Error fetching appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("Loading:", loading);
  console.log("Events:", events);
  console.log("Error:", error);

  return (
    <Box sx={{ p: 3, backgroundColor: "#f5f7fb" }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
          Dashboard
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Appointment Overview
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <NextAppointmentCard
                appointment={nextAppointment}
                loading={loading}
                error={error}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 3,
                pb: 2,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Event sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="h6">Calendar</Typography>
            </Box>
            <Box sx={{ height: 600 }}>
              {loading ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <CalendarView events={events} loading={loading} error={error} />
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Box, Button, Grid, Typography, Stack } from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SubjectIcon from "@mui/icons-material/Subject";
import NotesIcon from "@mui/icons-material/Notes";

dayjs.extend(customParseFormat);

interface AppointmentFormValues {
  id?: string;
  date: Dayjs | null;
  time: Dayjs | null;
  motive: string;
  obs: string;
}

interface AppointmentFormProps {
  initialValues?: {
    id?: string;
    date?: string;
    motive?: string;
    obs?: string;
  };
  onSubmit: (values: {
    id?: string;
    date: string;
    motive: string;
    obs: string;
    status: string;
  }) => void;
  onCancel: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
}) => {
  // Parse the initial datetime if available
  const initialDateTime = initialValues.date
    ? dayjs(initialValues.date, "DD/MM/YYYY HH:mm")
    : null;

  // Set default values and include the id if present
  const defaultValues: AppointmentFormValues = {
    id: initialValues.id,
    date: initialDateTime ? initialDateTime.startOf("day") : null,
    time: initialDateTime,
    motive: initialValues.motive || "",
    obs: initialValues.obs || "",
  };

  const { control, handleSubmit } = useForm<AppointmentFormValues>({
    defaultValues,
  });

  const onFormSubmit = (data: AppointmentFormValues) => {
    if (data.date && data.time) {
      // Combine the date (with a zeroed time) with the selected time values
      const combinedDateTime = data.date
        .hour(data.time.hour())
        .minute(data.time.minute())
        .second(0)
        .millisecond(0);
      onSubmit({
        id: data.id, // pass the id if it exists
        date: combinedDateTime.format("YYYY-MM-DDTHH:mm:ss[Z]"),
        motive: data.motive.trim(),
        obs: data.obs.trim(),
        status: "N",
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: { xs: 2, sm: 3 },
            pt: { xs: 1, sm: 2 },
          }}
        >
          {/* DateTime Section */}
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12} sm={6}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <EventIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2">Date *</Typography>
              </Stack>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        sx: {
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          },
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 1 }}
              >
                <AccessTimeIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2">Time *</Typography>
              </Stack>
              <Controller
                name="time"
                control={control}
                rules={{ required: "Time is required" }}
                render={({ field, fieldState: { error } }) => (
                  <TimePicker
                    value={field.value}
                    onChange={field.onChange}
                    ampm={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!error,
                        helperText: error?.message,
                        sx: {
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                          },
                        },
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          {/* Motive Section */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <SubjectIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2">Motive *</Typography>
            </Stack>
            <Controller
              name="motive"
              control={control}
              rules={{ required: "Motive is required" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                  placeholder="Brief description of the appointment"
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Observations Section */}
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 1 }}
            >
              <NotesIcon color="primary" fontSize="small" />
              <Typography variant="subtitle2">Observations</Typography>
            </Stack>
            <Controller
              name="obs"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Additional notes or observations"
                  sx={{
                    "& .MuiInputBase-input": {
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: { xs: 1, sm: 2 },
              justifyContent: "flex-end",
              mt: { xs: 1, sm: 2 },
              pt: { xs: 1, sm: 2 },
              borderTop: 1,
              borderColor: "divider",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              onClick={onCancel}
              variant="outlined"
              fullWidth={false}
              sx={{
                width: { xs: "100%", sm: "auto" },
                py: { xs: 1 },
                px: { xs: 2, sm: 3 },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                width: { xs: "100%", sm: "auto" },
                py: { xs: 1 },
                px: { xs: 2, sm: 3 },
              }}
            >
              Save
            </Button>
          </Box>
        </Box>
      </form>
    </LocalizationProvider>
  );
};

export default AppointmentForm;

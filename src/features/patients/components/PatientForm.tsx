import React, { useState } from "react";
import { TextField, Box, Button, MenuItem, Grid } from "@mui/material";
import { Patient } from "../types";

type PatientFormProps = {
  initialValues?: Patient;
  onSubmit: (values: Omit<Patient, "id">) => void;

  onCancel: () => void;
};

const PatientForm: React.FC<PatientFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
}) => {
  const [formValues, setFormValues] = useState({
    name: initialValues?.name || "",
    birth: initialValues?.birth || "",
    phone: initialValues?.phone || "",
    gender: initialValues?.gender || "",
    address: initialValues?.address || "",
    job: initialValues?.job || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formValues);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, sm: 3 }, // Responsive gap
        width: "100%",
        maxWidth: "100%",
        pt: { xs: 2, sm: 3 },
      }}
    >
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {" "}
        {/* Responsive spacing */}
        <Grid item xs={12} sm={6} md={4}>
          {" "}
          {/* Responsive grid */}
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            value={formValues.name}
            onChange={handleChange}
            required // Add required field indication
            sx={{
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.9rem", sm: "1rem" }, // Responsive font
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Birth Date"
            name="birth"
            variant="outlined"
            fullWidth
            value={formValues.birth}
            onChange={handleChange}
            required
            type="date"
            InputLabelProps={{
              shrink: true,
              sx: { fontSize: { xs: "0.9rem", sm: "1rem" } },
            }}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Phone"
            name="phone"
            variant="outlined"
            fullWidth
            value={formValues.phone}
            onChange={handleChange}
            required
            type="tel"
            sx={{
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Gender"
            name="gender"
            variant="outlined"
            fullWidth
            value={formValues.gender}
            onChange={handleChange}
            required
            select
            sx={{
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
            }}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Job"
            name="job"
            variant="outlined"
            fullWidth
            value={formValues.job}
            onChange={handleChange}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            name="address"
            variant="outlined"
            fullWidth
            value={formValues.address}
            onChange={handleChange}
            multiline // Allow multiple lines for address
            rows={2}
            sx={{
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.9rem", sm: "1rem" },
              },
            }}
          />
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 2 },
          justifyContent: "flex-end",
          mt: { xs: 2, sm: 3 }, // Add top margin for buttons
          flexDirection: { xs: "column", sm: "row" }, // Stack buttons on mobile
        }}
      >
        <Button
          onClick={onCancel}
          variant="outlined"
          fullWidth={false}
          sx={{
            width: { xs: "100%", sm: "auto" }, // Full width on mobile
            py: { xs: 1, sm: "inherit" }, // Taller touch target on mobile
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            width: { xs: "100%", sm: "auto" },
            py: { xs: 1 },
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default PatientForm;

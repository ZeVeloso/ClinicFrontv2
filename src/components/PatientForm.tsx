import React, { useState } from "react";
import { TextField, Box, Button, MenuItem, Grid } from "@mui/material";

type PatientFormProps = {
  initialValues?: {
    name: string;
    birth: string;
    phone: string;
    gender: string;
    address: string;
    job: string;
  };
  onSubmit: (values: {
    name: string;
    birth: string;
    phone: string;
    gender: string;
    address: string;
    job: string;
  }) => void;
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
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            value={formValues.name}
            onChange={handleChange}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Birth Date"
            name="birth"
            variant="outlined"
            fullWidth
            value={formValues.birth}
            onChange={handleChange}
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Phone"
            name="phone"
            variant="outlined"
            fullWidth
            value={formValues.phone}
            onChange={handleChange}
            margin="normal"
            type="tel"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Gender"
            name="gender"
            variant="outlined"
            fullWidth
            value={formValues.gender}
            onChange={handleChange}
            margin="normal"
            select
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Job"
            name="job"
            variant="outlined"
            fullWidth
            value={formValues.job}
            onChange={handleChange}
            margin="normal"
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
            margin="normal"
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default PatientForm;

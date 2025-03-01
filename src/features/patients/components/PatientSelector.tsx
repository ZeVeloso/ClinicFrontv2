import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Patient } from "../types";
import { getPatients, addPatient } from "../../../api/patients";
import PatientForm from "./PatientForm";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { debounce } from "lodash";
import { useToast } from "../../../contexts/ToastContext";

type PatientSelectorProps = {
  onPatientSelect: (patient: Patient | null) => void;
  selectedPatient?: Patient | null;
};

const PatientSelector: React.FC<PatientSelectorProps> = ({
  onPatientSelect,
  selectedPatient,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = useState(false);
  const { showToast } = useToast();

  // Memoize the search function
  const searchPatients = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm || searchTerm.length < 2) return;

      setLoading(true);
      try {
        const response = await getPatients({
          name: searchTerm,
          phone: "",
          page: 1,
          pageSize: 20,
        });
        setPatients(response.data || []);
      } catch (error) {
        console.error("Error searching patients:", error);
        showToast("Error searching patients", "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  // Memoize the debounced search function
  const debouncedSearch = useMemo(
    () => debounce(searchPatients, 300),
    [searchPatients]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleNewPatient = async (values: Omit<Patient, "id">) => {
    try {
      const response = await addPatient(values);
      const newPatient = response.data;
      setPatients((prev) => [newPatient, ...prev]);
      onPatientSelect(newPatient);
      setIsNewPatientDialogOpen(false);
      showToast("Patient added successfully", "success");
    } catch (error) {
      console.error("Error adding new patient:", error);
      showToast("Error adding patient", "error");
    }
  };

  const handleInputChange = (_: any, newInputValue: string) => {
    setInputValue(newInputValue);
    if (open && newInputValue) {
      debouncedSearch(newInputValue);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Autocomplete
          fullWidth
          open={open}
          onOpen={() => {
            setOpen(true);
            if (inputValue) {
              searchPatients(inputValue);
            }
          }}
          onClose={() => {
            setOpen(false);
            if (!selectedPatient) {
              setPatients([]);
            }
          }}
          options={patients}
          value={selectedPatient}
          loading={loading}
          getOptionLabel={(option) => `${option.name} (${option.phone})`}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          onChange={(_, newValue) => onPatientSelect(newValue)}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          filterOptions={(x) => x}
          noOptionsText={
            inputValue.length < 2
              ? "Type at least 2 characters to search"
              : loading
                ? "Loading..."
                : "No patients found"
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Patient"
              placeholder="Start typing name or phone..."
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <Box>
                <Typography variant="body1">{option.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.phone}
                </Typography>
              </Box>
            </li>
          )}
        />
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => setIsNewPatientDialogOpen(true)}
        >
          New Patient
        </Button>
      </Box>

      <Dialog
        open={isNewPatientDialogOpen}
        onClose={() => setIsNewPatientDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Patient</DialogTitle>
        <DialogContent>
          <PatientForm
            onSubmit={handleNewPatient}
            onCancel={() => setIsNewPatientDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PatientSelector;

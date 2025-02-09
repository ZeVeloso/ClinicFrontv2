import { useState, useEffect, useCallback } from "react";
import { getPatients, addPatient } from "../../../api/patients";
import { Patient } from "../types";
import { calculateAge } from "../../../utils/calculateAge";
import { useToast } from "../../../contexts/ToastContext";

export const usePatients = (
  filters: { name: string; phone: string },
  page: number,
  pageSize: number
) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPatients({
        ...filters,
        page: page + 1,
        pageSize,
      });
      const updatedPatients = response.data.map((patient: Patient) => ({
        ...patient,
        age: calculateAge(patient.birth),
      }));
      setPatients(updatedPatients);
      setTotalPatients(response.total);
    } catch (err) {
      //setError("Failed to fetch patients. Please try again later.");
      showToast("Error fetching Patients", "error");
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const addNewPatient = async (patientData: Omit<Patient, "id">) => {
    try {
      const response = await addPatient(patientData);
      const newPatient = response.data;
      setPatients((prev) => [
        ...prev,
        { ...newPatient, age: calculateAge(newPatient.birth) },
      ]);
      showToast("Patient added successfully", "success");
    } catch (err) {
      showToast("Error adding patient", "error");
    }
  };

  return {
    patients,
    totalPatients,
    loading,
    error,
    addNewPatient,
    fetchPatients,
  };
};

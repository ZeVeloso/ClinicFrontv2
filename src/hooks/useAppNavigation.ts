import { useNavigate } from 'react-router-dom';
import { APP_PATHS, PUBLIC_PATHS, generatePath } from '../config/navigationConfig';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    toLogin: () => navigate(PUBLIC_PATHS.LOGIN),
    toDashboard: () => navigate(APP_PATHS.DASHBOARD),
    toPatients: () => navigate(APP_PATHS.PATIENTS),
    toPatientDetails: (id: string) => 
      navigate(generatePath(APP_PATHS.PATIENT_DETAILS, { id })),
    toAppointments: () => navigate(APP_PATHS.APPOINTMENTS),
    toAppointmentDetails: (id: string) => 
      navigate(generatePath(APP_PATHS.APPOINTMENT_DETAILS, { id })),
  };
};
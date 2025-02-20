

export const PUBLIC_PATHS = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
} as const;

export const APP_PATHS = {
  ROOT: '/app',
  DASHBOARD: '/app/dashboard',
  PATIENTS: '/app/patients',
  PATIENT_DETAILS: '/app/patients/:id',
  APPOINTMENTS: '/app/appointments',
  APPOINTMENT_DETAILS: '/app/appointments/:id',
  MANAGEMENT: '/app/management',
} as const;

export const generatePath = (path: string, params?: Record<string, string>) => {
  if (!params) return path;
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    path
  );
};
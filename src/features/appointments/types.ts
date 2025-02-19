import { Patient } from "../patients/types";

export type Appointment = {
  id?: string;
  patient?: Patient;
  date: string;
  motive: string;
  cost?: number;
  status: string;
  obs: string;
};

import { Patient } from "./Patient";

export type Appointment = {
  id: string;
  patient?: Patient;
  date: string;
  motive: string;
  cost?: number;
  status: string;
  obs: string;
};

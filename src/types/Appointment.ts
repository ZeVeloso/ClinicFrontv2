import { Patient } from "./Patient";

export type Appointment = {
  id: string;
  patient?: Patient;
  date: string;
  motive: string;
  status: string;
  obs: string;
};

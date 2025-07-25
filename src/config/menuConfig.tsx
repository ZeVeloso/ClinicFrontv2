import HomeIcon from "@mui/icons-material/Home";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
import EventIcon from "@mui/icons-material/Event";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import { APP_PATHS } from "./navigationConfig";

export const appMenuItems = [
  { label: "Home", link: APP_PATHS.DASHBOARD, icon: <HomeIcon /> },
  { label: "Patients", link: APP_PATHS.PATIENTS, icon: <ElderlyWomanIcon /> },
  { label: "Appointments", link: APP_PATHS.APPOINTMENTS, icon: <EventIcon /> },
  {
    label: "Management",
    link: APP_PATHS.MANAGEMENT,
    icon: <ManageAccountsIcon />,
  },
];

export const profileMenuItems = [
  { label: "Profile", link: APP_PATHS.PROFILE, icon: <AccountBoxIcon /> },
  { label: "Settings", link: APP_PATHS.SETTINGS, icon: <SettingsIcon /> },
  {
    label: "Subscription",
    link: APP_PATHS.SUBSCRIPTION,
    icon: <PaymentIcon />,
  },
];

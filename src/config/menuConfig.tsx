import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ElderlyWomanIcon from "@mui/icons-material/ElderlyWoman";
import EventIcon from "@mui/icons-material/Event";

import SettingsIcon from "@mui/icons-material/Settings";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

export const appMenuItems = [
  { label: "Home", link: "/", icon: <HomeIcon /> },
  { label: "Patients", link: "/patients", icon: <ElderlyWomanIcon /> },
  { label: "Appointments", link: "/appointments", icon: <EventIcon /> },
];

export const profileMenuItems = [
  { label: "Profile", link: "/profile", icon: <AccountBoxIcon /> },
  { label: "Settings", link: "/settings", icon: <SettingsIcon /> },
];

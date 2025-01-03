import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2b3a67",
      light: "#41589b",
      dark: "#11182a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#496a81",
      light: "#628aa7",
      dark: "#1d2b34",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f5f5f5", // Light background color
      paper: "#ffffff", // Typically used for Paper components
    },
    text: {
      primary: "#000000", // Default text color
      secondary: "#666666", // Secondary text color
    },
    divider: "#e0e0e0", // Divider color
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export default theme;

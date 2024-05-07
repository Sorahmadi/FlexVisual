import { createTheme } from "@mui/material/styles";
export default createTheme({
  typography: {
    fontFamily: 'Nunito',
    useNextVariants: true,
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    background: {
      paper: "rgba(255, 255, 255, 1)",
      default: "rgba(255, 255, 255, 1)",
    },
    primary: {
      light: "rgba(0, 151, 160,1)",
      main:"rgba(0, 151, 160,1)",
      dark:"rgba(3, 142, 172,1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(128, 219, 239, 1)",
      main: "rgba(255, 133, 20, 1)",
      dark: "rgba(3, 142, 172, 1)",
      contrastText: "#fff",
    },
    tertiary:{
      light: "rgba(5, 5, 5, 1)",
      main: "rgba(5, 5, 5, 1)",
      dark: "rgba(5, 5, 5, 1)",
      contrastText: "#FF8514",

    },
    button:{
      light: "rgba(300, 149, 219, 1)",
      main:"rgba(0, 151, 160,1)",
      dark: "rgba(8, 84, 180, 1)",
      contrastText: "#000",

    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});

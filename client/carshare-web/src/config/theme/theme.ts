import { createTheme } from "@mui/material/styles";
import palette from "./palette";

const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "1em",
          color: "black",
          backgroundColor: "#eceef7",
          padding: "12px",
        },
      },
    },
  },
  palette,
});

export default theme;

import { Box, CircularProgress } from "@mui/material";

const FullPageProgressBar = () => (
  <Box sx={{ display: "flex", height: "100vh" }}>
    <CircularProgress sx={{ margin: "auto" }} />
  </Box>
);

export default FullPageProgressBar;

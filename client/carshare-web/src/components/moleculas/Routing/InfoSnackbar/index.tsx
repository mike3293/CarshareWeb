import { Box, Slide, Typography, SlideProps } from "@mui/material";
import DirectionsIcon from "@mui/icons-material/Directions";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { useMobile } from "src/hooks/useMedia";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

const InfoSnackbar = () => {
  const isMobile = useMobile();

  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      open={open}
      onClose={(_, reason) => reason !== "clickaway" && setOpen(false)}
      autoHideDuration={5000}
      TransitionComponent={SlideTransition}
      anchorOrigin={
        isMobile ? { vertical: "top", horizontal: "left" } : undefined
      }
      message={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography>
            Вы можете добавить новую точку маршрута{" "}
            {isMobile ? "долгим нажатием" : "кликнув правой кнопкой мыши"}
          </Typography>
          <InfoOutlinedIcon
            sx={{ color: "info.main", ml: 1 }}
            fontSize="large"
          />
        </Box>
      }
    />
  );
};

export default InfoSnackbar;

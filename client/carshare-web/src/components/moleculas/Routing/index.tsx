import { Box, Slide, styled, Typography, SlideProps } from "@mui/material";
import L from "leaflet";
import { Popup, useMap, useMapEvents } from "react-leaflet";
import DirectionsIcon from "@mui/icons-material/Directions";
import { Car } from "src/types/Car";
import { IRoutingProps } from "./types";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";
import { useMobile } from "src/hooks/useMedia";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

const Routing = ({ setWaypoints }: IRoutingProps) => {
  const isMobile = useMobile();

  const map = useMapEvents({
    contextmenu(e) {
      setWaypoints((oldValue) => [...oldValue, e.latlng]);
    },
  });

  const [open, setOpen] = useState(true);

  return (
    <Snackbar
      open={open}
      onClose={() => setOpen(false)}
      autoHideDuration={5000}
      TransitionComponent={SlideTransition}
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

export default Routing;

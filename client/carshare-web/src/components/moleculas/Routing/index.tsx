import { Icon, Button, styled, Typography } from "@mui/material";
import L from "leaflet";
import { Popup, useMap, useMapEvents } from "react-leaflet";
import DirectionsIcon from "@mui/icons-material/Directions";
import { Car } from "src/types/Car";
import { IRoutingProps } from "./types";
import Snackbar from "@mui/material/Snackbar";
import { useState } from "react";

const Routing = ({ setWaypoints }: IRoutingProps) => {
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
      message="Вы можете добавить новую точку маршрута кликом правой кнопки мыши (долгим нажатием на мобильном устройстве)"
    />
  );
};

export default Routing;

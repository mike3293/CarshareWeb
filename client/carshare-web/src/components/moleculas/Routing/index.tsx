import { Icon, Button, styled, Typography } from "@mui/material";
import L from "leaflet";
import { Popup, useMap, useMapEvents } from "react-leaflet";
import DirectionsIcon from "@mui/icons-material/Directions";
import { Car } from "src/types/Car";
import { IRoutingProps } from "./types";
import { useEffect } from "react";

const Root = styled("div")(({ theme }) => ({
  display: "grid",
  textAlign: "center",
  minWidth: theme.spacing(20),
  fontFamily: theme.typography.fontFamily,
}));

const Routing = ({ setWaypoints }: IRoutingProps) => {
  const map = useMapEvents({
    contextmenu(e) {
      setWaypoints((oldValue) => [...oldValue, e.latlng]);
    },
  });

  return null;
};

export default Routing;

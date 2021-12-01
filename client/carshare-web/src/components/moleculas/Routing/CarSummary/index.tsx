import {
  Box,
  styled,
  Typography,
  Dialog,
  SwipeableDrawer,
} from "@mui/material";
import L from "leaflet";
import { reduce } from "lodash";
import { Popup, useMapEvents } from "react-leaflet";
import DrawerWithEdge from "src/components/atoms/DrawerWithEdge";
import PortalComponent from "src/components/atoms/PortalComponent";
import React, { useEffect, useMemo, useState } from "react";
import { useRoutingStore } from "src/context/routingStore";
import { useMobile } from "src/hooks/useMedia";
import shallow from "zustand/shallow";
import getDurationString from "src/utils/getDurationString";
import { Car } from "src/types/Car";

const Root = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: theme.spacing(2),
  alignItems: "center",
}));

const CarImage = styled("img")(({ theme }) => ({
  height: theme.spacing(6),
}));

const CarSummary = ({ car }: { car: Car }) => (
  <Root>
    <CarImage src={car.imageUrl} />
    <div>
      <Typography>{car.model}</Typography>
      <Typography>{car.reg}</Typography>
    </div>
  </Root>
);

export default CarSummary;

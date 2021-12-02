import {
  Box,
  styled,
  Typography,
  Dialog,
  SwipeableDrawer,
  CircularProgress,
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
import {
  CarWithProviderId,
  CustomWaypoint,
} from "src/context/routingStore/types";
import { useQuery } from "react-query";
import services from "src/config/services";

const RouteSummary = ({
  car,
  summary,
  waypoints,
}: {
  car?: CarWithProviderId;
  summary: L.Routing.IRouteSummary | null;
  waypoints: CustomWaypoint[];
}) => {
  const parkingTime = useMemo(
    () =>
      summary &&
      reduce(waypoints, (acc, w) => acc + (w?.residenceTimeMins ?? 0), 0),
    [waypoints, summary]
  );

  const durationString = useMemo(
    () =>
      summary && getDurationString(summary.totalTime + (parkingTime ?? 0) * 60),
    [parkingTime, summary]
  );

  const { data: prices, isLoading } = useQuery(
    ["calculatePrices", car, summary, parkingTime],
    () =>
      services.routeCalculation.calculatePrices({
        car: { model: car!.model, providerId: car!.providerId },
        distance: Math.round(summary!.totalDistance),
        travelTime: Math.round(summary!.totalTime / 60),
        parkingTime: parkingTime ?? 0,
      }),
    { enabled: Boolean(car && summary), refetchOnWindowFocus: false }
  );

  return (
    <>
      <Typography>
        Расстояние:{" "}
        {summary ? `${(summary.totalDistance / 1000).toFixed(1)} км` : " - "},
        время в пути: {summary ? durationString : " - "}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Typography>
          Стоимость: {prices ? `${prices.price / 100} руб` : " - "}
        </Typography>
        {isLoading && <CircularProgress size={20} />}
      </Box>
    </>
  );
};

export default RouteSummary;

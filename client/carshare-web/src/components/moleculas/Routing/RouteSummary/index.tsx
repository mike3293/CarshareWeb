import {
  Box,
  styled,
  Typography,
  Dialog,
  SwipeableDrawer,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import L from "leaflet";
import { reduce, orderBy } from "lodash";
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

const AllTariffs = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[400],
  marginLeft: theme.spacing(1),
  cursor: "pointer",
}));

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
        meters: Math.round(summary!.totalDistance),
        minutesDriving: Math.round(summary!.totalTime / 60),
        minutesParking: parkingTime ?? 0,
      }),
    { enabled: Boolean(car && summary), refetchOnWindowFocus: false }
  );

  const sortedPrices = useMemo(
    () => prices && orderBy(prices, (p) => p.kopecks),
    [prices]
  );

  const bestPrice = sortedPrices && sortedPrices[0];

  return (
    <>
      <Typography>
        Расстояние:{" "}
        {summary ? `${(summary.totalDistance / 1000).toFixed(1)} км` : " - "},
        время в пути: {summary ? durationString : " - "}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Typography
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          Тариф:{" "}
          {bestPrice && `${bestPrice.name} - ${bestPrice.kopecks / 100} руб`}
          {sortedPrices && sortedPrices.length > 1 && (
            <Tooltip
              title={sortedPrices
                .map((p) => `${p.name} - ${p.kopecks / 100} руб`)
                .join(", ")}
            >
              <AllTariffs variant="body2">все тарифы</AllTariffs>
            </Tooltip>
          )}
        </Typography>
        {isLoading && <CircularProgress size={20} />}
      </Box>
    </>
  );
};

export default RouteSummary;

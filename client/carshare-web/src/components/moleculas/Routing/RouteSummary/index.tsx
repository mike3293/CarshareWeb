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
import { reduce, orderBy, last } from "lodash";
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
import { Section } from "src/services/routeCalculation/types";

const AllTariffs = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[400],
  marginLeft: theme.spacing(1),
  cursor: "pointer",
}));

const RouteSummary = ({
  car,
  waypoints,
  route,
}: {
  car?: CarWithProviderId;
  route: L.Routing.IRoute | null;
  waypoints: CustomWaypoint[];
}) => {
  const { summary, instructions } = route || {};

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

  // TODO: move sections to own useMemo
  const { data: prices, isLoading } = useQuery(
    ["calculatePrices", car, instructions, waypoints],
    () => {
      const residenceTimeInWaypoints = waypoints
        .map((w) => w.residenceTimeMins)
        .reverse();
      const routeSections: Section[] = instructions!.reduce(
        (acc, i) => {
          if (i.type === "DestinationReached") {
            acc.push({
              meters: 0,
              seconds: 0,
              parkingMinutes: residenceTimeInWaypoints.pop() ?? 0,
            });

            return acc;
          }

          if (i.type === "WaypointReached") {
            acc.push(
              {
                meters: 0,
                seconds: 0,
                parkingMinutes: residenceTimeInWaypoints.pop() ?? 0,
              },
              {
                meters: 0,
                seconds: 0,
                parkingMinutes: 0,
              }
            );

            return acc;
          }

          const lastInstruction = last(acc);

          if (lastInstruction) {
            lastInstruction.meters += i.distance;
            lastInstruction.seconds += i.time;
          }

          return acc;
        },
        [
          {
            meters: 0,
            seconds: 0,
            parkingMinutes: residenceTimeInWaypoints.pop() ?? 0,
          },
        ]
      );

      console.log(routeSections);

      return services.routeCalculation.calculatePrices({
        car: { model: car!.model, providerId: car!.providerId },
        routeSections,
      });
    },
    { enabled: Boolean(car && instructions), refetchOnWindowFocus: false }
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

import {
  Box,
  styled,
  Typography,
  CircularProgress,
  Tooltip,
  ClickAwayListener,
} from "@mui/material";
import L from "leaflet";
import { reduce, orderBy, last } from "lodash";
import React, { useMemo, useState } from "react";
import getDurationString from "src/utils/getDurationString";
import {
  CarWithProvider,
  CustomWaypoint,
} from "src/context/routingStore/types";
import { useQuery } from "react-query";
import services from "src/config/services";
import { Section } from "src/services/routeCalculation/types";
import { useMobile } from "src/hooks/useMedia";

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
  car?: CarWithProvider;
  route: L.Routing.IRoute | null;
  waypoints: CustomWaypoint[];
}) => {
  const { summary, instructions } = route || {};

  const isMobile = useMobile();

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

  const residenceTimeInWaypoints = waypoints
    .map((w) => w.residenceTimeMins)
    .reverse();

  // TODO: move sections to own useMemo
  const { data: prices, isLoading } = useQuery(
    [
      "calculatePrices",
      car?.id,
      instructions,
      residenceTimeInWaypoints.reduce((acc: number, t) => (acc += t ?? 0), 0),
    ],
    () => {
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

  const [allTariffsOpen, setAllTariffsOpen] = useState(false);

  const bestPrice = sortedPrices && sortedPrices[0];

  return (
    <>
      <Typography>
        ????????????????????:{" "}
        {summary ? `${(summary.totalDistance / 1000).toFixed(1)} ????` : " - "},
        ?????????? ?? ????????: {summary ? durationString : " - "}
      </Typography>
      <Box sx={{ display: "flex" }}>
        <Typography
          component="div"
          sx={{ display: "flex", alignItems: "center" }}
        >
          ??????????:{" "}
          {bestPrice && `${bestPrice.name} - ${bestPrice.kopecks / 100} ??????`}
          {sortedPrices && sortedPrices.length > 1 && (
            <ClickAwayListener onClickAway={() => setAllTariffsOpen(false)}>
              <Tooltip
                open={allTariffsOpen}
                onClose={() => {
                  !isMobile && setAllTariffsOpen(false);
                }}
                onOpen={() => setAllTariffsOpen(true)}
                title={
                  <div>
                    {sortedPrices.map((p) => (
                      <Typography key={p.name}>
                        {p.name} - {p.kopecks / 100} ??????
                      </Typography>
                    ))}
                  </div>
                }
              >
                <AllTariffs
                  variant="body2"
                  onClick={() => setAllTariffsOpen(true)}
                >
                  ?????? ????????????
                </AllTariffs>
              </Tooltip>
            </ClickAwayListener>
          )}
        </Typography>
        {isLoading && <CircularProgress size={20} />}
      </Box>
    </>
  );
};

export default RouteSummary;

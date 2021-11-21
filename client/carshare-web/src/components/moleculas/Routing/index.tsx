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
import { IRoutingProps } from "./types";
import React, { useEffect, useMemo, useState } from "react";
import InfoSnackbar from "./InfoSnackbar";
import WaypointsList from "./WaypointsList";
import { useRoutingStore } from "src/context/routingStore";
import { useMobile } from "src/hooks/useMedia";
import shallow from "zustand/shallow";
import getDurationString from "src/utils/getDurationString";

const Routing = ({ routingMachine }: IRoutingProps) => {
  const isMobile = useMobile();
  const [summary, setSummary] = useState<L.Routing.IRouteSummary | null>(null);
  const [addWaypoint, waypoints] = useRoutingStore(
    (s) => [s.addWaypoint, s.waypoints],
    shallow
  );

  useMapEvents({
    contextmenu(e) {
      addWaypoint(e.latlng);
    },
  });

  useEffect(() => {
    routingMachine.on("routesfound", (e: L.Routing.RoutingResultEvent) => {
      const routes = e.routes;
      if (routes[0].summary) {
        console.log(routes[0].summary);
        setSummary(routes[0].summary);
      }
    });

    return () => {
      routingMachine.on("routesfound", () => {});
    };
  }, [routingMachine]);

  useEffect(() => {
    if (waypoints.length === 1 && summary) {
      setSummary(null);
    }
  }, [waypoints, summary]);

  const durationString = useMemo(
    () =>
      summary &&
      getDurationString(
        summary.totalTime +
          reduce(waypoints, (acc, w) => acc + (w?.residenceTimeMins ?? 0), 0) *
            60
      ),
    [waypoints, summary]
  );

  const renderDialogContent = () => (
    <Box sx={{ px: 2 }}>
      <Typography sx={{ pb: 1, minHeight: (theme) => theme.spacing(3) }}>
        {summary && (
          <>
            Расстояние: {(summary.totalDistance / 1000).toFixed(1)} км, время в
            пути: {durationString}
          </>
        )}
      </Typography>

      <WaypointsList />
    </Box>
  );

  return (
    <>
      <InfoSnackbar />
      {isMobile ? (
        <PortalComponent>
          <DrawerWithEdge
            summary={
              summary
                ? `Время в пути: ${durationString}`
                : "Постройте ваш маршрут"
            }
          >
            {renderDialogContent()}
          </DrawerWithEdge>
        </PortalComponent>
      ) : (
        <Dialog
          open={true}
          sx={{ pointerEvents: "none" }}
          PaperProps={{
            sx: {
              pointerEvents: "auto",
              top: 0,
              left: 0,
              position: "absolute",
              m: 1,
              py: 2,
              borderRadius: 2,
              // tmp
              width: 400,
              height: 500,
            },
          }}
          hideBackdrop
        >
          {renderDialogContent()}
        </Dialog>
      )}
    </>
  );
};

export default Routing;

import {
  Box,
  styled,
  Typography,
  Dialog,
  SwipeableDrawer,
} from "@mui/material";
import L from "leaflet";
import { Popup, useMapEvents } from "react-leaflet";
import DrawerWithEdge from "src/components/atoms/DrawerWithEdge";
import PortalComponent from "src/components/atoms/PortalComponent";
import { IRoutingProps } from "./types";
import React, { useEffect, useState } from "react";
import InfoSnackbar from "./InfoSnackbar";
import WaypointsList from "./WaypointsList";
import { useRoutingStore } from "src/context/routingStore";
import { useMobile } from "src/hooks/useMedia";

const Routing = ({ routingMachine }: IRoutingProps) => {
  const isMobile = useMobile();
  const [summary, setSummary] = useState<L.Routing.IRouteSummary>();
  const addWaypoint = useRoutingStore((s) => s.addWaypoint);

  const map = useMapEvents({
    contextmenu(e) {
      addWaypoint(e.latlng);
    },
  });

  useEffect(() => {
    routingMachine.on("routesfound", (e: L.Routing.RoutingResultEvent) => {
      const routes = e.routes;
      if (routes[0].summary) {
        setSummary(routes[0].summary);
      }
      // alert distance and time in km and minutes
      // alert(
      //   "Total distance is " +
      //     summary.totalDistance / 1000 +
      //     " km and total time is " +
      //     Math.round(summary.totalTime / 60) +
      //     " minutes"
      // );
    });

    return () => {
      routingMachine.on("routesfound", () => {});
    };
  }, [routingMachine]);

  const renderDialogContent = () => (
    <Box sx={{ px: 2 }}>
      <WaypointsList />
      {summary && (
        <Typography>
          Total distance is {summary.totalDistance / 1000} km and total time is{" "}
          {Math.round(summary.totalTime / 60)} minutes
        </Typography>
      )}
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
                ? `Время в пути: ${Math.round(summary.totalTime / 60)} минут`
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
              width: 300,
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

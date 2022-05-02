import {
  Box,
  styled,
  Typography,
  Dialog,
  SwipeableDrawer,
} from "@mui/material";
import L from "leaflet";
import { isNumber, reduce } from "lodash";
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
import CarSummary from "./CarSummary";
import RouteSummary from "./RouteSummary";
import RouteActions from "./RouteActions";
import { useUserStore } from "src/context/userStore";

const Routing = ({ routingMachine }: IRoutingProps) => {
  const isMobile = useMobile();
  const [route, setRoute] = useState<L.Routing.IRoute | null>(null);
  const [selectedCar, addWaypoint, waypoints] = useRoutingStore(
    (s) => [s.selectedCar, s.addWaypoint, s.waypoints],
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
        // console.log("route", routes[0]);
        setRoute(routes[0]);
      }
    });

    return () => {
      routingMachine.on("routesfound", () => {});
    };
  }, [routingMachine]);

  useEffect(() => {
    if (waypoints.length === 1 && route?.summary) {
      setRoute(null);
    }
  }, [waypoints, route]);

  const userId = useUserStore((s) => s.id);

  const renderDialogContent = () => (
    <Box
      sx={{
        px: 2,
        display: "grid",
        gridAutoFlow: "row",
        gap: 1,
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex" }}>
        {selectedCar && <CarSummary car={selectedCar} />}
        {userId && <RouteActions sx={{ ml: "auto" }} userId={userId} />}
      </Box>
      <RouteSummary car={selectedCar} route={route} waypoints={waypoints} />
      <WaypointsList />
    </Box>
  );

  return (
    <>
      <InfoSnackbar />
      {isMobile ? (
        <PortalComponent>
          <DrawerWithEdge summary={route ? `Детали` : "Постройте ваш маршрут"}>
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

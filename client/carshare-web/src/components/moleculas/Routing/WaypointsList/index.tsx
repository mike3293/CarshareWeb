import { Box, styled, Typography, Dialog } from "@mui/material";
import L from "leaflet";
import { Popup, useMapEvents } from "react-leaflet";
import { Car } from "src/types/Car";
import { useEffect, useState } from "react";
import { useRoutingStore } from "src/context/routingStore";

import geocoder from "@maptiler/geocoder";

const WaypointsList = () => {
  const [summary, setSummary] = useState<L.Routing.IRouteSummary>();
  const waypoints = useRoutingStore((s) => s.waypoints);

  return (
    <Box>
      {waypoints.map((w) => (
        <Box>
          <Typography>
            {w.lat}, {w.lng}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default WaypointsList;

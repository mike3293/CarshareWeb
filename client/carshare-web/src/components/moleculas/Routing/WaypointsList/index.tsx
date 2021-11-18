import { Box, styled, Typography, Dialog } from "@mui/material";
import L from "leaflet";
import { Popup, useMapEvents } from "react-leaflet";
import { Car } from "src/types/Car";
import { useEffect, useState } from "react";
import { useRoutingStore } from "src/context/routingStore";

const WaypointsList = () => {
  const [summary, setSummary] = useState<L.Routing.IRouteSummary>();
  const waypoints = useRoutingStore((s) => s.waypoints);

  return (
    <Box>
      {waypoints.map((w, i) => (
        <Box key={i}>
          <Typography>
            {w.lat}, {w.lng}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default WaypointsList;

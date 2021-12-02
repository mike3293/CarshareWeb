import {
  Box,
  styled,
  Typography,
  Dialog,
  SwipeableDrawer,
  Theme,
  IconButton,
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
import { SxProps } from "@mui/system";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import { IUserStore } from "src/context/userStore/types";

const RoutActions = ({
  sx,
  userId,
}: {
  sx: SxProps<Theme>;
  userId: IUserStore["id"];
}) => {
  const [waypoints, setWaypoints] = useRoutingStore(
    (s) => [s.waypoints, s.setWaypoints],
    shallow
  );

  const fetchSavedRoute = async () => {};

  const uploadRoute = async () => {};

  return (
    <Box sx={sx}>
      <IconButton color="secondary">
        <DownloadIcon onClick={fetchSavedRoute} />
      </IconButton>
      <IconButton color="secondary">
        <SaveIcon onClick={uploadRoute} />
      </IconButton>
      {userId}
    </Box>
  );
};

export default RoutActions;

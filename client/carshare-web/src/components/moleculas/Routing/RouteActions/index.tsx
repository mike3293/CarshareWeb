import {
  Box,
  styled,
  Typography,
  Dialog,
  SwipeableDrawer,
  Theme,
  IconButton,
  Tooltip,
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
import { SxProps } from "@mui/system";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import { IUserStore } from "src/context/userStore/types";
import { useMutation } from "react-query";

const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const RouteActions = ({
  sx,
  userId,
}: {
  sx: SxProps<Theme>;
  userId: string;
}) => {
  const [fetchWaypoints, saveWaypoints] = useRoutingStore(
    (s) => [s.fetchWaypoints, s.saveWaypoints],
    shallow
  );

  const { mutate: load, isLoading: isLoading } = useMutation<
    void,
    Error,
    string
  >((userId) => fetchWaypoints(userId));

  const { mutate: save, isLoading: isSaving } = useMutation<
    void,
    Error,
    string
  >((userId) => saveWaypoints(userId));

  const inProgress = isSaving || isLoading;

  return (
    <Root sx={sx}>
      {inProgress && <CircularProgress size={20} />}
      <Tooltip title="Загрузить сохраненный маршрут">
        <IconButton
          onClick={() => load(userId)}
          disabled={inProgress}
          color="secondary"
        >
          <DownloadIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Сохранить текущий маршрут">
        <IconButton
          onClick={() => save(userId)}
          disabled={inProgress}
          color="secondary"
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>
    </Root>
  );
};

export default RouteActions;

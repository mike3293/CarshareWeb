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
import { useFiltersStore } from "src/context/filtersStore";

const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const FilterActions = ({
  sx,
  userId,
}: {
  sx?: SxProps<Theme>;
  userId: string;
}) => {
  const [fetchProviderIds, saveProviderIds] = useFiltersStore(
    (s) => [s.fetchFilters, s.saveFilters],
    shallow
  );

  const { mutate: load, isLoading: isLoading } = useMutation<
    void,
    Error,
    string
  >((userId) => fetchProviderIds(userId));

  const { mutate: save, isLoading: isSaving } = useMutation<
    void,
    Error,
    string
  >((userId) => saveProviderIds(userId));

  const inProgress = isSaving || isLoading;

  return (
    <Root sx={sx}>
      <Tooltip title="Сохранить текущие фильтры">
        <IconButton
          onClick={() => save(userId)}
          disabled={inProgress}
          color="secondary"
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Загрузить сохраненные фильтры">
        <IconButton
          onClick={() => load(userId)}
          disabled={inProgress}
          color="secondary"
        >
          <DownloadIcon />
        </IconButton>
      </Tooltip>
      {inProgress && <CircularProgress size={20} />}
    </Root>
  );
};

export default FilterActions;

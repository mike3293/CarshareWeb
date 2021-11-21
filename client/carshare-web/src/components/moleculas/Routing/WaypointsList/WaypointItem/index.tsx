import { Box, styled, Typography, Dialog, IconButton } from "@mui/material";
import L from "leaflet";
import shallow from "zustand/shallow";
import { Car } from "src/types/Car";
import React, { PropsWithChildren, ReactNode, useMemo, useState } from "react";
import { useRoutingStore } from "src/context/routingStore";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import moveArrayItem from "src/utils/moveArrayItem";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { grey, red, green } from "@mui/material/colors";
import { getAddressString } from "src/utils/getAddressString";
import { CustomWaypoint } from "src/context/routingStore/types";
import TimeSelect from "src/components/moleculas/TimeSelect";

interface IWaypointItemProps {
  waypoint: CustomWaypoint;
  disableActions?: boolean;
  children?: ReactNode;
}

const WaypointItem = ({
  waypoint,
  disableActions,
  children,
}: IWaypointItemProps) => {
  const removeWaypoint = useRoutingStore((s) => s.removeWaypoint);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 35px",
        gap: 1,
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: grey[100],
          py: 0.5,
          px: 2,
          borderRadius: 2,
          minHeight: 36,
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          {getAddressString(waypoint)}
        </Typography>
        {!disableActions && (
          <Box sx={{ display: "flex", ml: 1 }}>
            <TimeSelect waypoint={waypoint} />
            <IconButton
              sx={{
                ml: 0.5,
                p: 0.25,
                color: red[200],
                "&:hover": {
                  color: red[400],
                },
              }}
              onClick={() => removeWaypoint(waypoint)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};

export default WaypointItem;

import { Box, Tooltip, IconButton } from "@mui/material";
import shallow from "zustand/shallow";
import React from "react";
import { useRoutingStore } from "src/context/routingStore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  resetServerContext,
} from "react-beautiful-dnd";
import moveArrayItem from "src/utils/moveArrayItem";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { grey, red } from "@mui/material/colors";
import { getAddressString } from "src/utils/getAddressString";
import WaypointItem from "./WaypointItem";
import { useMobile } from "src/hooks/useMedia";
import CancelIcon from "@mui/icons-material/Cancel";

// TODO: remove and check
resetServerContext();

const WaypointsList = () => {
  const isMobile = useMobile();

  const [waypoints, setWaypoints, resetWaypoints] = useRoutingStore(
    (s) => [s.waypoints, s.setWaypoints, s.resetWaypoints],
    shallow
  );

  const onDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedWaypoints = moveArrayItem(
      waypoints,
      result.source.index + 1,
      result.destination.index + 1
    );

    setWaypoints(reorderedWaypoints);
  };

  const [firstWaypoint, ...draggableWaypoints] = waypoints;

  return (
    // TODO: adjust height
    <Box sx={isMobile ? { height: "35vh", overflowY: "scroll" } : undefined}>
      <Box sx={{ mb: 2 }}>
        <WaypointItem disableActions waypoint={firstWaypoint}>
          <Tooltip title="Закрыть маршрут">
            <IconButton
              sx={{
                color: red[400],
                p: 0.5,
              }}
              onClick={resetWaypoints}
            >
              <CancelIcon sx={{ fontSize: 27 }} />
            </IconButton>
          </Tooltip>
        </WaypointItem>
      </Box>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {draggableWaypoints.map((w, index) => (
                <Draggable key={w.id} draggableId={w.id} index={index}>
                  {(provided) => (
                    <Box
                      sx={{ py: 0.5 }}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <WaypointItem waypoint={w}>
                        <Box
                          {...provided.dragHandleProps}
                          onTouchStart={(e) => e.stopPropagation()}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            visibility:
                              draggableWaypoints.length === 1
                                ? "hidden"
                                : "initial",
                          }}
                        >
                          <DragHandleIcon
                            fontSize="large"
                            sx={{ color: grey[400] }}
                          />
                        </Box>
                      </WaypointItem>
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
};

export default WaypointsList;

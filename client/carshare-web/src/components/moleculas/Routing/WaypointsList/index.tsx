import { Box, styled, Typography, Dialog } from "@mui/material";
import L from "leaflet";
import shallow from "zustand/shallow";
import { Car } from "src/types/Car";
import React, { useMemo, useState } from "react";
import { useRoutingStore } from "src/context/routingStore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import moveArrayItem from "src/utils/moveArrayItem";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { grey } from "@mui/material/colors";
import { getAddressString } from "src/utils/getAddressString";

const WaypointsList = () => {
  const [summary, setSummary] = useState<L.Routing.IRouteSummary>();
  const [waypoints, setWaypoints] = useRoutingStore(
    (s) => [s.waypoints, s.setWaypoints],
    shallow
  );

  // return (
  //   <Box>
  //     {waypoints.map((w) => (
  //       <Box key={w.id}>
  //         <Typography>
  //           {w.lat}, {w.lng}
  //         </Typography>
  //       </Box>
  //     ))}
  //   </Box>
  // );

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

    console.log(reorderedWaypoints);

    setWaypoints(reorderedWaypoints);
  };

  const draggableWaypoints = useMemo(() => waypoints.slice(1), [waypoints]);

  const first = waypoints[0];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Typography>{getAddressString(first)}</Typography>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {draggableWaypoints.map((w, index) => (
              <Draggable key={w.id} draggableId={w.id} index={index}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{getAddressString(w)}</Typography>
                    {draggableWaypoints.length !== 1 && (
                      <Box
                        {...provided.dragHandleProps}
                        onTouchStart={(e) => e.stopPropagation()}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <DragHandleIcon
                          fontSize="large"
                          sx={{ color: grey[400] }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default WaypointsList;

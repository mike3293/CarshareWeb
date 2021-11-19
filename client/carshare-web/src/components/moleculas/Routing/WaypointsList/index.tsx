import { Box, styled, Typography, Dialog } from "@mui/material";
import L from "leaflet";
import shallow from "zustand/shallow";
import { Car } from "src/types/Car";
import React, { useEffect, useState } from "react";
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
      result.source.index,
      result.destination.index
    );

    console.log(reorderedWaypoints);

    setWaypoints(reorderedWaypoints);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {waypoints.map((w, index) => (
              <Draggable key={w.id} draggableId={w.id} index={index}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography sx={{ color: "black", zIndex: 2000 }}>
                      {w.lat}, {w.lng}
                    </Typography>
                    <Box
                      {...provided.dragHandleProps}
                      onTouchStart={(e) => e.stopPropagation()}
                    >
                      <DragHandleIcon
                        fontSize="large"
                        sx={{ color: grey[400] }}
                      />
                    </Box>
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

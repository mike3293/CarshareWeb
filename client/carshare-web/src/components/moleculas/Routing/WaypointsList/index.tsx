import { Box, styled, Typography, Dialog } from "@mui/material";
import L from "leaflet";
import shallow from "zustand/shallow";
import { Car } from "src/types/Car";
import { useEffect, useState } from "react";
import { useRoutingStore } from "src/context/routingStore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import moveArrayItem from "src/utils/moveArrayItem";

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
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {w.lat}, {w.lng}
                  </div>
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

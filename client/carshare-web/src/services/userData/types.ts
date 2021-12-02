import { CustomWaypoint } from "src/context/routingStore/types";

export interface RouteWaypoints {
  userId: string;

  waypoints: CustomWaypoint[];
}

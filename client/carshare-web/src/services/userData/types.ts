import { CustomWaypoint } from "src/context/routingStore/types";

export interface RouteWaypoints {
  userId: string;

  waypoints: CustomWaypoint[];
}

export interface Filters {
  userId: string;

  providerIds: string[];
}

import { CustomWaypoint } from "src/context/routingStore/types";

interface CarSummary {
  model: string;
  providerId: string;
}

export interface Section {
  meters: number;
  seconds: number;
  parkingMinutes: number;
}

export interface IRouteInfoRequest {
  car: CarSummary;
  routeSections: Section[];
  waypoints: CustomWaypoint[];
}

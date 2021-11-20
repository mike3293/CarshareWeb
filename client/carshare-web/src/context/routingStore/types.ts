import L from "leaflet";
import { Address } from "src/types/Address";

export interface CustomWaypoint extends L.LatLng {
  id: string;
  address?: Address;
  residenceTime?: number | null;
}

export interface IRoutingStore {
  waypoints: CustomWaypoint[];
  setWaypoints: (waypoints: CustomWaypoint[]) => void;
  setRawWaypoints: (waypoints: L.Routing.Waypoint[]) => Promise<void>;
  addWaypoint: (waypoint: L.LatLng) => Promise<void>;
  setResidenceTime: (
    waypoint: CustomWaypoint,
    residenceTime: number
  ) => void;
  resetResidenceTime: (waypoint: CustomWaypoint) => void;
  removeWaypoint: (waypoint: CustomWaypoint) => void;
  resetWaypoints: () => void;
}

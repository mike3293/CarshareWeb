import L from "leaflet";
import { Address } from "src/types/Address";

export interface CustomWaypoint extends L.LatLng {
  id: string;
  address?: Address;
}

export interface IRoutingStore {
  waypoints: CustomWaypoint[];
  setWaypoints: (waypoints: CustomWaypoint[]) => void;
  setRawWaypoints: (waypoints: L.Routing.Waypoint[]) => Promise<void>;
  addWaypoint: (waypoint: L.LatLng) => Promise<void>;
}

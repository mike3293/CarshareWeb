import L from "leaflet";

export interface CustomWaypoint extends L.LatLng {
  id: string;
}

export interface IRoutingStore {
  waypoints: CustomWaypoint[];
  setWaypoints: (waypoints: CustomWaypoint[]) => void;
  addWaypoint: (waypoint: L.LatLng) => void;
}

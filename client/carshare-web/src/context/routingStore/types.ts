import L from "leaflet";

export interface CustomWaypoint extends L.LatLng {
  id: string;
}

export interface IRoutingStore {
  waypoints: CustomWaypoint[];
  setWaypoints: (waypoints: CustomWaypoint[]) => void;
  setRawWaypoints: (waypoints: L.Routing.Waypoint[]) => void;
  addWaypoint: (waypoint: L.LatLng) => void;
}

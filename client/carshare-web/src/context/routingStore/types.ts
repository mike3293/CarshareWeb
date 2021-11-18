import L from "leaflet";

export type IRoutingStore = {
  waypoints: L.LatLng[];
  setWaypoints: (providerIds: L.LatLng[]) => void;
  addWaypoint: (wp: L.LatLng) => void;
};

import L, { ControlOptions } from "leaflet";

export interface IRoutingMachineProps extends ControlOptions {
  waypoints?: L.LatLng[];
}

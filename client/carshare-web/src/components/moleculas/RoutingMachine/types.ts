import { ControlOptions } from "leaflet";
import { CustomWaypoint } from "src/context/routingStore/types";

export interface IRoutingMachineProps extends ControlOptions {
  waypoints?: CustomWaypoint[];
  refreshWaypoints?: () => void;
}

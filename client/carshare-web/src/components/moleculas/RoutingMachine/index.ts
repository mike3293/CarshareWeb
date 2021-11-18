import L, { Control } from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import { IRoutingMachineProps } from "./types";

const createRoutineMachineLayer = ({ waypoints }: IRoutingMachineProps) => {
  const instance = L.Routing.control({
    waypoints: waypoints ?? [],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }],
      extendToWaypoints: true,
      missingRouteTolerance: 5,
    },
    show: false,
    autoRoute: true,
    addWaypoints: true,
    routeWhileDragging: true,
    showAlternatives: false,
    fitSelectedRoutes: false,
    geocoder: () => null,
  }).on("routeselected", function (e) {
    var route = e.route;
    // alert(
    //   "Showing route between waypoints:\n" +
    //     JSON.stringify(route.inputWaypoints, null, 2)
    // );
  });

  return instance;
};

const RoutingMachine = createControlComponent<Control, IRoutingMachineProps>(
  createRoutineMachineLayer
);

export default RoutingMachine;

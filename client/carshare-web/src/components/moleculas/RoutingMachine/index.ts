import L, { Control } from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import { IRoutingMachineProps } from "./types";

const createRoutineMachineLayer = ({
  waypoints,
  refreshWaypoints,
}: IRoutingMachineProps) => {
  const instance = L.Routing.control({
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }],
      extendToWaypoints: true,
      missingRouteTolerance: 5,
    },
    show: false,
    autoRoute: true,
    routeWhileDragging: true,
    showAlternatives: false,
    fitSelectedRoutes: false,
    addWaypoints: false,
    geocoder: () => null,
    router: L.Routing.osrmv1({
      serviceUrl: "https://routing.openstreetmap.de/routed-car/route/v1",
    }),
    plan: L.Routing.plan(waypoints ?? [], {
      createMarker: function (i, wp) {
        return L.marker(wp.latLng, { draggable: i !== 0 }).on(
          "dragend",
          (e) => {
            refreshWaypoints && refreshWaypoints();
          }
        );
      },
    }),
  });

  return instance;
};

const RoutingMachine = createControlComponent<Control, IRoutingMachineProps>(
  createRoutineMachineLayer
);

export default RoutingMachine;

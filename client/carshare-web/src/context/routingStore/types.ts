import L from "leaflet";
import { Address } from "src/types/Address";
import { Car } from "src/types/Car";

export interface CarWithProviderId extends Car {
  providerId: string;
}
export interface CustomWaypoint extends L.LatLng {
  id: string;
  address?: Address;
  residenceTimeMins?: number | null;
}

export interface IRoutingStore {
  selectedCar?: CarWithProviderId;
  waypoints: CustomWaypoint[];
  setWaypoints: (waypoints: CustomWaypoint[]) => void;
  setRawWaypoints: (waypoints: L.Routing.Waypoint[]) => Promise<void>;
  addCarWaypoint: (car: Car, providerId: string) => Promise<void>;
  addWaypoint: (waypoint: L.LatLng) => Promise<void>;
  setResidenceTimeMins: (
    waypointId: CustomWaypoint["id"],
    residenceTime: number
  ) => void;
  resetResidenceTimeMins: (waypointId: CustomWaypoint["id"]) => void;
  removeWaypoint: (waypoint: CustomWaypoint) => void;
  resetWaypoints: () => void;
}

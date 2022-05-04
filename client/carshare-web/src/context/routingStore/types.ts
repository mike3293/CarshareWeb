import L from "leaflet";
import { Address } from "src/types/Address";
import { Car } from "src/types/Car";

export interface CarWithProvider extends Car {
  providerId: string;
  providerName: string;
}
export interface CustomWaypoint extends L.LatLng {
  id: string;
  address?: Address;
  residenceTimeMins?: number | null;
}

export interface IRoutingStore {
  selectedCar?: CarWithProvider;
  carsToCompare: CarWithProvider[];
  waypoints: CustomWaypoint[];
  setWaypoints: (waypoints: CustomWaypoint[]) => void;
  fetchWaypoints: (userId: string) => Promise<void>;
  saveWaypoints: (userId: string) => Promise<void>;
  setRawWaypoints: (waypoints: L.Routing.Waypoint[]) => Promise<void>;
  startRouteWithCar: (carId: Car["id"]) => Promise<void>;
  removeCarFromComparison: (carId: Car["id"]) => void;
  addCarToComparison: (
    car: Car,
    providerId: string,
    providerName: string
  ) => void;
  addWaypoint: (waypoint: L.LatLng) => Promise<void>;
  setResidenceTimeMins: (
    waypointId: CustomWaypoint["id"],
    residenceTime: number
  ) => void;
  resetResidenceTimeMins: (waypointId: CustomWaypoint["id"]) => void;
  removeWaypoint: (waypoint: CustomWaypoint) => void;
  resetWaypoints: () => void;
}

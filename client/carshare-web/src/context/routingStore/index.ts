import create from "zustand";
import { CustomWaypoint, IRoutingStore } from "./types";
import services from "src/config/services";
import L from "leaflet";
import { uniqueId } from "src/utils/uniqueId";

const routingStore = (preloadedState = {}) => {
  return create<IRoutingStore>((set, get) => ({
    waypoints: [],
    selectedCar: undefined,
    setWaypoints: (waypoints) => set({ waypoints }),
    fetchWaypoints: async (userId) => {
      const fetchedWaypoints = await services.userData.getRoute(userId);

      set({
        waypoints: [
          get().waypoints[0],
          ...fetchedWaypoints.map(
            (w) =>
              ({
                ...w,
                ...L.latLng(w),
              } as CustomWaypoint)
          ),
        ],
      });
    },
    saveWaypoints: async (userId) => {
      await services.userData.saveRoute({
        waypoints: get().waypoints.slice(1),
        userId,
      });
    },
    setRawWaypoints: async (rawWaypoints) => {
      const waypoints = get().waypoints.slice();

      let waypointToChangeIndex = -1;

      rawWaypoints.forEach((rw, i) => {
        if (rw.latLng && waypoints[i] && !rw.latLng.equals(waypoints[i])) {
          waypointToChangeIndex = i;
        }
      });

      if (waypointToChangeIndex !== -1) {
        const newWaypoint = rawWaypoints[waypointToChangeIndex].latLng;
        const address = await services.geocoding.getAddress(
          newWaypoint.lat,
          newWaypoint.lng
        );

        waypoints[waypointToChangeIndex] = {
          ...waypoints[waypointToChangeIndex],
          ...newWaypoint,
          address,
        } as CustomWaypoint;

        set({ waypoints });
      }
    },
    resetWaypoints: () => {
      set({ waypoints: [] });
    },
    addWaypoint: async (waypoint) => {
      const address = await services.geocoding.getAddress(
        waypoint.lat,
        waypoint.lng
      );

      set({
        waypoints: [
          ...get().waypoints,
          { ...waypoint, id: uniqueId(), address } as CustomWaypoint,
        ],
      });
    },
    addCarWaypoint: async (car, providerId) => {
      const address = await services.geocoding.getAddress(car.lat, car.lon);

      set({
        selectedCar: { ...car, providerId },
        waypoints: [
          ...get().waypoints,
          {
            ...L.latLng({ lat: car.lat, lng: car.lon }),
            id: uniqueId(),
            address,
          } as CustomWaypoint,
        ],
      });
    },
    removeWaypoint: (waypoint) => {
      const waypoints = get().waypoints.filter((w) => w.id !== waypoint.id);

      set({ waypoints });
    },
    setResidenceTimeMins: (waypointId, residenceTime) => {
      const waypoints = get().waypoints.slice();
      console.log(residenceTime);
      // TODO: check
      waypoints[
        waypoints.findIndex((w) => w.id === waypointId)
      ].residenceTimeMins = residenceTime;

      set({ waypoints });
    },
    resetResidenceTimeMins: (waypointId) => {
      const waypoints = get().waypoints.slice();

      // TODO: check
      waypoints[
        waypoints.findIndex((w) => w.id === waypointId)
      ].residenceTimeMins = undefined;

      set({ waypoints });
    },
    ...preloadedState,
  }));
};

let zustandStore: ReturnType<typeof routingStore>;
export const getFiltersStore = (initialState?: Partial<IRoutingStore>) => {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === "undefined") {
    return routingStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!zustandStore) {
    zustandStore = routingStore(initialState);
  }

  return zustandStore;
};

export const useRoutingStore = routingStore();

export const getHasWaypoints = (state: IRoutingStore) =>
  state.waypoints.length != 0;

export const getWaypointsResidenceTime = (
  state: IRoutingStore,
  waypointId: CustomWaypoint["id"]
) => state.waypoints.find((w) => w.id === waypointId)?.residenceTimeMins;

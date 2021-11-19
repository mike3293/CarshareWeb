import create from "zustand";
import { uniqueId } from "lodash";
import { CustomWaypoint, IRoutingStore } from "./types";
import services from "src/config/services";
import { mapGeoAddressToAddress } from "src/types/Address";

const routingStore = (preloadedState = {}) => {
  return create<IRoutingStore>((set, get) => ({
    waypoints: [],
    setWaypoints: (waypoints) => set({ waypoints }),
    setRawWaypoints: async (rawWaypoints) => {
      const waypoints = get().waypoints.slice();

      let waypointToChangeIndex = -1;

      rawWaypoints.forEach((rw, i) => {
        if (rw.latLng && waypoints[i] && !rw.latLng.equals(waypoints[i])) {
          waypointToChangeIndex = i;
        }
      });

      console.log(waypointToChangeIndex);

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
    removeWaypoint: (waypoint) => {
      const waypoints = get().waypoints.filter((w) => w.id !== waypoint.id);

      set({ waypoints });
    },
    updateResidenceTime: (waypoint, residenceTime) => {
      const waypoints = get().waypoints.slice();

      waypoints[waypoints.findIndex((w) => w.id === waypoint.id)] = {
        ...waypoint,
        residenceTime,
      } as CustomWaypoint;

      set({ waypoints });
    },
    resetResidenceTime: (waypoint) => {
      const waypoints = get().waypoints.slice();

      waypoints[waypoints.findIndex((w) => w.id === waypoint.id)] = {
        ...waypoint,
        residenceTime: null,
      } as CustomWaypoint;

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

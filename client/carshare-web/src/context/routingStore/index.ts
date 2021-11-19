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

      // const waypointToChange = rawWaypoints.findIndex((rw) =>
      //   waypoints.some((w) => w.id === rw.name)
      // );

      // if (waypointToChange !== -1) {
      //   const newWaypoint = rawWaypoints[waypointToChange].latLng;

      //   const address = await services.geocoding.getAddress(
      //     newWaypoint.lat,
      //     newWaypoint.lng
      //   );

      //   waypoints[waypointToChange] = {
      //     ...waypoints[waypointToChange],
      //     ...newWaypoint,
      //     address,
      //   } as CustomWaypoint;

      //   set({ waypoints });
      // }
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

import create from "zustand";
import { uniqueId } from "lodash";
import { CustomWaypoint, IRoutingStore } from "./types";

const routingStore = (preloadedState = {}) => {
  return create<IRoutingStore>((set, get) => ({
    waypoints: [],
    setWaypoints: (waypoints) => set({ waypoints }),
    setRawWaypoints: (rawWaypoints) =>
      set({
        waypoints: rawWaypoints.map(
          (w) => ({ ...w.latLng, id: uniqueId() } as CustomWaypoint)
        ),
      }),
    addWaypoint: (waypoint) =>
      set({
        waypoints: [
          ...get().waypoints,
          { ...waypoint, id: uniqueId() } as CustomWaypoint,
        ],
      }),
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

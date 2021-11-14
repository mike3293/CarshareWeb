import create from "zustand";
import { IFiltersStore } from "./types";

///
const filtersStore = (preloadedState = {}) => {
  return create<IFiltersStore>((set) => ({
    selectedProviderIds: [],
    setProviderIds: (providers) => set({ selectedProviderIds: providers }),
    selectedFuelLevel: null,
    setFuelLevel: (fuelLevel) => set({ selectedFuelLevel: fuelLevel }),
    ...preloadedState,
  }));
};

let zustandStore: ReturnType<typeof filtersStore>;
export const getFiltersStore = (initialState?: Partial<IFiltersStore>) => {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === "undefined") {
    return filtersStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!zustandStore) {
    zustandStore = filtersStore(initialState);
  }

  return zustandStore;
};

export const useFiltersStore = getFiltersStore();

import create, { GetState, SetState } from "zustand";
import { persist, StoreApiWithPersist } from "zustand/middleware";
import { IFiltersStore } from "./types";

const filtersStore = (preloadedState = {}) => {
  return create(
    persist<
      IFiltersStore,
      SetState<IFiltersStore>,
      GetState<IFiltersStore>,
      StoreApiWithPersist<IFiltersStore>
    >(
      (set) => ({
        selectedProviderIds: [],
        setProviderIds: (providers) => set({ selectedProviderIds: providers }),
        selectedFuelLevel: null,
        setFuelLevel: (fuelLevel) => set({ selectedFuelLevel: fuelLevel }),
        ...preloadedState,
      }),
      { name: "filters-storage" }
    )
  );
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

import create, { GetState, SetState } from "zustand";
import { persist, StoreApiWithPersist } from "zustand/middleware";
import { IUserStore } from "./types";

const userStore = (preloadedState = {}) => {
  return create<IUserStore>((set) => ({
    user: null,
    setOidcUser: (user) => {
      set({ user });
    },
    ...preloadedState,
  }));
};

let zustandStore: ReturnType<typeof userStore>;
export const getUserStore = (initialState?: Partial<IUserStore>) => {
  // Always make a new store if server, otherwise state is shared between requests
  if (typeof window === "undefined") {
    return userStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!zustandStore) {
    zustandStore = userStore(initialState);
  }

  return zustandStore;
};

export const useUserStore = getUserStore();

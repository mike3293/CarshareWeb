import create from "zustand";
import { IUserStore } from "./types";

const userStore = (preloadedState = {}) => {
  return create<IUserStore>((set) => ({
    id: undefined,
    accessToken: undefined,
    email: undefined,
    role: undefined,
    isMainAdmin: undefined,
    setOidcUser: (user) => {
      set({
        id: user.profile.user_id,
        accessToken: user.access_token,
        email: user.profile.email,
        role: user.profile.role,
        isMainAdmin: user.profile.is_main_admin,
      });
    },
    resetUser: () => {
      set({
        id: undefined,
        accessToken: undefined,
        email: undefined,
        role: undefined,
        isMainAdmin: undefined,
      });
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

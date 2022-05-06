import { StoreApi } from "zustand";
import { IUserStore } from "src/context/userStore/types";

export type UserStoreApi = StoreApi<IUserStore>;

import { Provider } from "src/types/Provider";

export interface IFiltersStore {
  selectedProviderIds: string[];
  setProviderIds: (providerIds: string[]) => void;
  selectedFuelLevel: number | null;
  setFuelLevel: (fuelLevel: number | null) => void;
}

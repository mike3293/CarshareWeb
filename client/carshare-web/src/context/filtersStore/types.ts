export interface IFiltersStore {
  selectedProviderIds: string[];
  setProviderIds: (providerIds: string[]) => void;
  fetchFilters: (userId: string) => Promise<void>;
  saveFilters: (userId: string) => Promise<void>;
  selectedFuelLevel: number | null;
  setFuelLevel: (fuelLevel: number | null) => void;
}

export interface IFiltersStore {
  selectedProviderIds: string[];
  setProviderIds: (providerIds: string[]) => void;
  fetchProviderIds: (userId: string) => Promise<void>;
  saveProviderIds: (userId: string) => Promise<void>;
  selectedFuelLevel: number | null;
  setFuelLevel: (fuelLevel: number | null) => void;
}

import { Provider } from "./Provider";

interface CarPrice {
  brand?: string;
  model: string;
  perMinCost?: number;
  perMinParkingCost?: number;
}

export interface ProviderWithTarrifs {
  id: string;
  provider: Provider;
  carPrices: CarPrice[];
}

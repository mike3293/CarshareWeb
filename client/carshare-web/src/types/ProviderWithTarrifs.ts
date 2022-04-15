import { Provider } from './Provider';

export interface PackageTariff {
  name: string;
  isBase: boolean;
  kopecksCost?: number;
  kopecksPerMinute?: number;
  kopecksPerMinuteParking?: number;
  kopecksPerKilometer?: number;
  minutesIncluded?: number;
  parkingMinutesIncluded?: number;
  kilometersIncluded?: number;
}

export interface CarPrice {
  brand?: string;
  model: string;
  packageTariffs: PackageTariff[];
}

export interface ProviderWithTarrifs {
  id: string;
  provider: Provider;
  carPrices: CarPrice[];
}

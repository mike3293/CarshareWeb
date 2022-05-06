import { Provider } from "src/types/Provider";

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

export interface ProviderWithTarrifs extends Provider {
  carPrices: CarPrice[];
}

export interface CarPriceWithProviderId {
  model: string;
  providerId: string;
  packageTariffs: PackageTariff[];
}

export interface TariffOverride {
  userId: string;
  carPrices: CarPriceWithProviderId[];
}

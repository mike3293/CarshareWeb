export interface Tariff {
  name: string;
  kopecksCost?: number;
  kopecksPerMinute?: number;
  kopecksPerMinuteParking?: number;
  kopecksPerKilometer?: number;
  minutesIncluded?: number;
  parkingMinutesIncluded?: number;
  kilometersIncluded?: number;
}

export interface ProviderTarrifsFormValues {
  carsTarrifs: Array<{
    model: string;
    brand?: string;
    packageTariffs: Tariff[];
  }>;
}

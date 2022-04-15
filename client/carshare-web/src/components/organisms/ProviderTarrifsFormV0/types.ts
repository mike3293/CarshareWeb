export interface ProviderTarrifsFormValues {
  carsTarrifs: Array<{
    model: string;
    brand?: string;
    perMinCost?: number;
    perMinParkingCost?: number;
  }>;
}

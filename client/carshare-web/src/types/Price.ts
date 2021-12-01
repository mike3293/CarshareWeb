export enum TariffType {
  Minute = "Minute",
}

export interface Price {
  price: number;
  tariffType: TariffType;
}

enum PlateFormat {
  Belarus = "by",
  Russia = "ru",
}
export interface PublicProvider {
  id: string;
  name: string;
  pinUrl: string;
  logoUrl: string;
}
export interface PublicCar {
  id: string;
  latPrecise?: number;
  lat: number;
  lonPrecise?: number;
  lon: number;
  fuel: number;
  reg?: string;
  brand?: string;
  model: string;
  imageUrl?: string;
  licensePlateFormat?: PlateFormat;
  provider: PublicProvider;
}

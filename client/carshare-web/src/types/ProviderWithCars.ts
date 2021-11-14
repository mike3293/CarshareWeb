import { Car } from "./Car";

export interface ProviderWithCars {
  id: string;
  name: string;
  pinUrl: string;
  logoUrl: string;
  cars: Car[];
}

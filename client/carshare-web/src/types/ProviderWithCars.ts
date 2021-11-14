import { Car } from "./Car";
import { Provider } from "./Provider";

export interface ProviderWithCars extends Provider {
  pinUrl: string;
  cars: Car[];
}

import { Provider } from "src/types/Provider";
import { ProviderWithCars } from "src/types/ProviderWithCars";
import ServiceBase from "./serviceBase";
import { useUserStore } from "src/context/userStore";
class PublicCarsService extends ServiceBase {
  constructor(baseURL: string) {
    super();
    this.initialize({ baseURL });
  }

  public getCars(
    providerIds?: string[],
    fuelLevel?: number | null
  ): Promise<ProviderWithCars[]> {
    return this.get("publicCars", { fuelLevel, providerIds });
  }

  public getProvidersSummary(): Promise<Provider[]> {
    return this.get("publicCars/providersSummary");
  }
}

export default PublicCarsService;

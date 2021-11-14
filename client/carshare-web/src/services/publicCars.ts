import { ProviderWithCars } from "src/types/ProviderWithCars";
import ServiceBase from "./serviceBase";

class PublicCarsService extends ServiceBase {
  constructor(baseURL: string) {
    super();
    this.initialize({ baseURL });
  }

  public getCars(): Promise<ProviderWithCars[]> {
    return this.get("publicCars");
  }
}

export default PublicCarsService;

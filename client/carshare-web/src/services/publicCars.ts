import { PublicCar } from "src/types/PublicCar";
import ServiceBase from "./serviceBase";

class PublicCarsService extends ServiceBase {
  constructor(baseURL: string) {
    super();
    this.initialize({ baseURL });
  }

  public getCars(): Promise<PublicCar[]> {
    return this.get("publicCars");
  }
}

export default PublicCarsService;

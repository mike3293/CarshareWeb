import { PublicCar } from "src/types/PublicCar";
import ServiceBase from "./serviceBase";

class PublicCarsService extends ServiceBase {
  constructor() {
    super();
    // this.initialize({ baseURL });
  }

  public getCars(): Promise<PublicCar[]> {
    return this.get("https://localhost:2001/api" + "/publicCars");
  }
}

export default PublicCarsService;

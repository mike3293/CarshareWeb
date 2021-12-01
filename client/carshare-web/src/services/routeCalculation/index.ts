import { Price } from "src/types/Price";
import ServiceBase from "../serviceBase";
import { IRouteInfoRequest } from "./types";

class RouteCalculationService extends ServiceBase {
  constructor(baseURL: string) {
    super();
    this.initialize({ baseURL });
  }

  public async calculatePrices(route: IRouteInfoRequest): Promise<Price> {
    return this.post("routePrices", route);
  }
}

export default RouteCalculationService;

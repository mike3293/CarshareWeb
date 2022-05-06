import { Price } from "src/types/Price";
import NotStrictAuthService from "../notStrictAuthService";
import { UserStoreApi } from "../notStrictAuthService/types";
import { IRouteInfoRequest } from "./types";

class RouteCalculationService extends NotStrictAuthService {
  constructor(baseURL: string, store: UserStoreApi) {
    super(store);
    this.initialize({ baseURL });
  }

  public async calculatePrices(route: IRouteInfoRequest): Promise<Price[]> {
    return this.post("routePrices", route);
  }
}

export default RouteCalculationService;

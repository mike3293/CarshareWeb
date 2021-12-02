import { CustomWaypoint } from "src/context/routingStore/types";
import { Price } from "src/types/Price";
import AuthService from "../authService";
import { UserStoreApi } from "../authService/types";
import { Filters, RouteWaypoints } from "./types";

class UserDataService extends AuthService {
  constructor(baseURL: string, store: UserStoreApi) {
    super(store);
    this.initialize({ baseURL });
  }

  public async getRoute(userId: string): Promise<CustomWaypoint[]> {
    return this.get(`routes/${userId}`);
  }

  public async saveRoute(route: RouteWaypoints): Promise<void> {
    return this.post("routes", route);
  }

  public async getFilters(userId: string): Promise<Filters> {
    return this.get(`filters/${userId}`);
  }

  public async saveFilters(filters: Filters): Promise<void> {
    return this.post("filters", filters);
  }
}

export default UserDataService;

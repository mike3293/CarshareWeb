import { Price } from "src/types/Price";
import AuthService from "../authService";
import { UserStoreApi } from "../authService/types";
import { RouteWaypoints } from "./types";

class UserDataService extends AuthService {
  constructor(baseURL: string, store: UserStoreApi) {
    super(store);
    this.initialize({ baseURL });
  }

  public async getRoute(userId: string): Promise<RouteWaypoints> {
    return this.get(`routes/${userId}`);
  }

  public async saveRoute(route: RouteWaypoints): Promise<void> {
    return this.post("routes", route);
  }
}

export default UserDataService;

import ServiceBase from "../serviceBase";
import { UserStoreApi } from "./types";
class AuthService extends ServiceBase {
  store!: UserStoreApi;
  constructor(store: UserStoreApi) {
    super();
    this.store = store;
  }

  public activeStore(store: UserStoreApi) {
    this.store = store;
  }

  async willSendRequest(request: RequestInit) {
    let accessToken = this.store.getState().accessToken;

    if (accessToken) {
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
  }

  async refreshToken(request: RequestInit) {
    let accessToken = this.store.getState().accessToken;

    if (accessToken) {
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
  }
}

export default AuthService;

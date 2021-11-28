import { authManager } from "src/utils/authManager";
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

  async refreshSession() {
    const user = await authManager.signinSilent();

    this.store.getState().setOidcUser(user);
  }
}

export default AuthService;

import { throttle } from "lodash";
import { authManager } from "src/utils/authManager";
import ServiceBase from "../serviceBase";
import { UserStoreApi } from "./types";

class NotStrictAuthService extends ServiceBase {
  store!: UserStoreApi;

  constructor(store: UserStoreApi) {
    super();
    this.store = store;
  }

  public activeStore(store: UserStoreApi) {
    this.store = store;
  }

  async willSendRequest(request: RequestInit) {
    const user = await authManager.getUser();
    let accessToken = user?.access_token;

    console.log(
      "user exp",
      user?.expired,
      new Date((user?.expires_at ?? 0) * 1000),
      user?.access_token
    );

    if (accessToken) {
      if (user?.expired) {
        const refreshedUser = await authManager.signinSilent();
        accessToken = refreshedUser.access_token;

        this.store.getState().setOidcUser(refreshedUser);
      }

      if (accessToken) {
        request.headers = {
          ...request.headers,
          Authorization: `Bearer ${accessToken}`,
        };
      }
    }
  }
}

export default NotStrictAuthService;

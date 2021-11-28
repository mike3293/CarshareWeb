import { UserManager } from "oidc-client";
import constants from "src/config/constants";

const managerConfig = {
  authority: constants.IS_URL,
  client_id: constants.CLIENT_ID,
  redirect_uri: `${constants.BASE_URL}/auth/signin-oidc`,
  silent_redirect_uri: `${constants.BASE_URL}/auth/signin-oidc-silent`,
  popup_post_logout_redirect_uri: `${constants.BASE_URL}/auth/logout-oidc`,
  response_type: "code",
  scope: "openid profile",
  revokeAccessTokenOnSignout: true,
};

let authManagerLocal: UserManager;
const getAuthManager = () => {
  // Always make a new if server, otherwise manager is shared between requests
  if (typeof window === "undefined") {
    // throw new Error("SSR auth not implemented");
    return null;
  }

  // Create if unavailable on the client and set it on the window object
  if (!authManagerLocal) {
    authManagerLocal = new UserManager(managerConfig);
  }

  return authManagerLocal;
};

export const authManager = getAuthManager();

export interface IUserStore {
  accessToken?: string;
  email?: string;
  role?: string;
  isMainAdmin?: string;
  setOidcUser: (user: Oidc.User) => void;
  resetUser: () => void;
}

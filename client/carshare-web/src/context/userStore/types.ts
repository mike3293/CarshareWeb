import { Role } from "src/types/Role";

export interface IUserStore {
  accessToken?: string;
  email?: string;
  role?: Role;
  isMainAdmin?: string;
  setOidcUser: (user: Oidc.User) => void;
  resetUser: () => void;
}

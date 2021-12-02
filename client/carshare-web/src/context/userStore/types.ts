import { Role } from "src/types/Role";

export interface IUserStore {
  id?: string;
  accessToken?: string;
  email?: string;
  role?: Role;
  isMainAdmin?: string;
  setOidcUser: (user: Oidc.User) => void;
  resetUser: () => void;
}

import { AppUser } from "src/types/AppUser";

export interface IUserStore {
  user: AppUser | null;
  setOidcUser: (user: Oidc.User) => void;
}

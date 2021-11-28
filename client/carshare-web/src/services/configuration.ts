import { Provider } from "src/types/Provider";
import { ProviderWithCars } from "src/types/ProviderWithCars";
import AuthService from "./authService";
import { useUserStore } from "src/context/userStore";
import { UserStoreApi } from "./authService/types";

class ConfigurationService extends AuthService {
  constructor(baseURL: string, store: UserStoreApi) {
    super(store);
    this.initialize({ baseURL });
  }

  public getTarrifs(): Promise<any[]> {
    return this.get("tarrifs");
  }
}

export default ConfigurationService;

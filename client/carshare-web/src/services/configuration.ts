import { CarPrice, ProviderWithTarrifs } from "src/types/ProviderWithTarrifs";
import { ProviderWithCars } from "src/types/ProviderWithCars";
import AuthService from "./authService";
import { useUserStore } from "src/context/userStore";
import { UserStoreApi } from "./authService/types";

class ConfigurationService extends AuthService {
  constructor(baseURL: string, store: UserStoreApi) {
    super(store);
    this.initialize({ baseURL });
  }

  public getTarrifs(): Promise<ProviderWithTarrifs[]> {
    return this.get("tarrifs");
  }

  public updateTarrifs(id: string, carPrices: CarPrice[]): Promise<void> {
    return this.put(`tarrifs/${id}`, carPrices);
  }
}

export default ConfigurationService;

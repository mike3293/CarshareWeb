import {
  CarPrice,
  PackageTariff,
  ProviderWithTarrifs,
} from "src/types/ProviderWithTarrifs";
import { ProviderWithCars } from "src/types/ProviderWithCars";
import AuthService from "./authService";
import { useUserStore } from "src/context/userStore";
import { UserStoreApi } from "./authService/types";

class ConfigurationService extends AuthService {
  constructor(baseURL: string, store: UserStoreApi) {
    super(store);
    this.initialize({ baseURL });
  }

  public getTariffs(): Promise<ProviderWithTarrifs[]> {
    return this.get("tarrifs");
  }

  public updateTariffs(
    providerId: string,
    carModel: CarPrice["model"],
    packageTariffs: PackageTariff[]
  ): Promise<void> {
    return this.put(
      `tarrifs/providers/${providerId}/cars/${carModel}`,
      packageTariffs
    );
  }
}

export default ConfigurationService;

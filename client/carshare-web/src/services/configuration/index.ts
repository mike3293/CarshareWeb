import {
  CarPrice,
  PackageTariff,
  ProviderWithTarrifs,
  TariffOverride,
} from "./types";
import AuthService from "../authService";
import { UserStoreApi } from "../authService/types";

class ConfigurationService extends AuthService {
  constructor(baseURL: string, store: UserStoreApi) {
    super(store);
    this.initialize({ baseURL });
  }

  public getTariffOverrides(): Promise<TariffOverride> {
    return this.get("tariffOverrides");
  }

  public createTariffOverride(
    providerId: string,
    carModel: string,
    packageTariffs: PackageTariff[]
  ): Promise<void> {
    return this.post(
      `tariffOverrides/providers/${providerId}/cars/${carModel}`,
      packageTariffs
    );
  }

  public updateTariffOverride(
    providerId: string,
    carModel: string,
    packageTariffs: PackageTariff[]
  ): Promise<void> {
    return this.put(
      `tariffOverrides/providers/${providerId}/cars/${carModel}`,
      packageTariffs
    );
  }

  public removeTariffOverride(
    providerId: string,
    carModel: string
  ): Promise<void> {
    return this.delete(
      `tariffOverrides/providers/${providerId}/cars/${carModel}`
    );
  }

  public getTariffs(): Promise<ProviderWithTarrifs[]> {
    return this.get("tarrifs");
  }

  public updateTariffs(
    providerId: string,
    carModel: string,
    packageTariffs: PackageTariff[]
  ): Promise<void> {
    return this.put(
      `tarrifs/providers/${providerId}/cars/${carModel}`,
      packageTariffs
    );
  }
}

export default ConfigurationService;

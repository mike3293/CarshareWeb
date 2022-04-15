import {
  CarPrice,
  PackageTariff,
  ProviderWithTarrifs,
} from 'src/types/ProviderWithTarrifs';
import { ProviderWithCars } from 'src/types/ProviderWithCars';
import AuthService from './authService';
import { useUserStore } from 'src/context/userStore';
import { UserStoreApi } from './authService/types';

class ConfigurationService extends AuthService {
  constructor(baseURL: string, store: UserStoreApi) {
    super(store);
    this.initialize({ baseURL });
  }

  public getTarrifs(): Promise<ProviderWithTarrifs[]> {
    return this.get('tarrifs');
  }

  public updateTarrifsOld(id: string, carPrices: CarPrice[]): Promise<void> {
    return this.put(`tarrifs/${id}`, carPrices);
  }

  public updateTarrifs(
    providerId: string,
    carModel: CarPrice['model'],
    packageTariffs: PackageTariff[]
  ): Promise<void> {
    return this.put(`tarrifs/providers/${providerId}/models/${carModel}`, packageTariffs);
  }
}

export default ConfigurationService;

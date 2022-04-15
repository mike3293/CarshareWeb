import { PackageTariff } from 'src/types/ProviderWithTarrifs';

export interface UniqueTariff extends PackageTariff {
  id: string;
}

import { PackageTariff } from "src/services/configuration/types";

export interface UniqueTariff extends PackageTariff {
  id: string;
}

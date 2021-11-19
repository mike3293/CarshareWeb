import {
  Address,
  mapGeoAddressToAddress,
  GeoAddresses,
} from "src/types/Address";
import { Provider } from "src/types/Provider";
import { ProviderWithCars } from "src/types/ProviderWithCars";
import ServiceBase from "./serviceBase";

class GeocodingService extends ServiceBase {
  constructor(baseURL: string) {
    super();
    this.initialize({ baseURL });
  }

  public async getAddress(lat: number, lon: number): Promise<Address | null> {
    const result = await this.post<GeoAddresses>("geolocate/address", {
      lat,
      lon,
      count: 1,
      radius_meters: 1000,
    });

    return result.suggestions[0]
      ? mapGeoAddressToAddress(result.suggestions[0])
      : null;
  }
}

export default GeocodingService;

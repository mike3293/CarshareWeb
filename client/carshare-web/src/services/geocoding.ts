import {
  Address,
  mapGeoAddressToAddress,
  GeoAddresses,
} from "src/types/Address";
import ServiceBase from "./serviceBase";

class GeocodingService extends ServiceBase {
  constructor(baseURL: string) {
    super();
    this.initialize({ baseURL });
  }

  public async getAddress(lat: number, lon: number): Promise<Address | null> {
    const result = await this.post<GeoAddresses>(
      "geolocate/address",
      {
        lat,
        lon,
        count: 1,
        radius_meters: 1000,
      },
      undefined,
      {
        headers: {
          Authorization: `Token f6d8ce2e6b793ca55914daa972f6f86132e09d95`,
        },
      }
    );

    return result.suggestions[0]
      ? mapGeoAddressToAddress(result.suggestions[0])
      : null;
  }
}

export default GeocodingService;

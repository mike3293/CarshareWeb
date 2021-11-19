export interface Address {
  settlementWithType?: string;
  cityWithType?: string;
  streetWithType?: string;
  houseWithType?: string;
}

export interface GeoAddress {
  value: string;
  data: {
    settlement_with_type: string;
    city_with_type: string;
    street_with_type?: string;
    house_type?: string;
    house?: string;
  };
}

export interface GeoAddresses {
  suggestions: {
    [key: number]: GeoAddress;
  };
}

export const mapGeoAddressToAddress = (geoAddress: GeoAddress): Address => ({
  settlementWithType: geoAddress.data.settlement_with_type,
  cityWithType: geoAddress.data.city_with_type,
  streetWithType: geoAddress.data.street_with_type,
  houseWithType:
    geoAddress.data.house_type && geoAddress.data.house
      ? `${geoAddress.data.house_type} ${geoAddress.data.house}`
      : undefined,
});

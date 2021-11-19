import { CustomWaypoint } from "src/context/routingStore/types";

export const getAddressString = (waypoint: CustomWaypoint) => {
  const addressComponents: string[] = [];

  const pushLatLng = () =>
    addressComponents.push(waypoint.lat.toFixed(7), waypoint.lng.toFixed(7));

  if (waypoint.address) {
    const { settlementWithType, cityWithType, streetWithType, houseWithType } =
      waypoint.address;

    if (settlementWithType) {
      settlementWithType && addressComponents.push(settlementWithType);
    } else if (cityWithType) {
      addressComponents.push(cityWithType);
    }

    if (streetWithType) {
      addressComponents.push(streetWithType);

      if (houseWithType) {
        addressComponents.push(houseWithType);
      }
    } else {
      pushLatLng();
    }
  } else {
    pushLatLng();
  }

  return addressComponents.join(", ");
};

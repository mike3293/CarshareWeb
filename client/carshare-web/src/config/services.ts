import PublicCarsService from "src/services/publicCars";
import GeocodingService from "src/services/geocoding";
import constants from "./constants";
import { useUserStore } from "src/context/userStore";
import ConfigurationService from "src/services/configuration";

export default {
  publicCars: new PublicCarsService(constants.BASE_API_URL),
  geocoding: new GeocodingService(constants.GEOCODER_API_URL),
  configuration: new ConfigurationService(
    constants.CONFIG_API_URL,
    useUserStore
  ),
};

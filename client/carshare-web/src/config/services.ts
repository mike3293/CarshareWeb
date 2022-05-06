import PublicCarsService from "src/services/publicCars";
import GeocodingService from "src/services/geocoding";
import constants from "./constants";
import { useUserStore } from "src/context/userStore";
import ConfigurationService from "src/services/configuration";
import RouteCalculationService from "src/services/routeCalculation";
import UserDataService from "src/services/userData";

export default {
  publicCars: new PublicCarsService(constants.CARS_API_URL),
  geocoding: new GeocodingService(constants.GEOCODER_API_URL),
  routeCalculation: new RouteCalculationService(
    constants.CALCULATOR_API_URL,
    useUserStore
  ),
  userData: new UserDataService(constants.USER_DATA_API_URL, useUserStore),
  configuration: new ConfigurationService(
    constants.CONFIG_API_URL,
    useUserStore
  ),
};

import PublicCarsService from "src/services/publicCars";
import GeocodingService from "src/services/geocoding";
import constants from "./constants";
import { useUserStore } from "src/context/userStore";
import ConfigurationService from "src/services/configuration";
import RouteCalculationService from "src/services/routeCalculation";

export default {
  publicCars: new PublicCarsService(constants.CARS_API_URL),
  geocoding: new GeocodingService(constants.GEOCODER_API_URL),
  routeCalculation: new RouteCalculationService(constants.CALCULATOR_API_URL),
  configuration: new ConfigurationService(
    constants.CONFIG_API_URL,
    useUserStore
  ),
};

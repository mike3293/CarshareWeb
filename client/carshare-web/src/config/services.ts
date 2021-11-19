import PublicCarsService from "src/services/publicCars";
import GeocodingService from "src/services/geocoding";
import { BASE_API_URL, GEOCODER_API_URL } from "./constants";

export default {
  publicCars: new PublicCarsService(BASE_API_URL),
  geocoding: new GeocodingService(GEOCODER_API_URL),
};

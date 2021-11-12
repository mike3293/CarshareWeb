import PublicCarsService from "src/services/publicCars";
import { BASE_API_URL } from "./constants";

export default {
  publicCars: new PublicCarsService(BASE_API_URL),
};

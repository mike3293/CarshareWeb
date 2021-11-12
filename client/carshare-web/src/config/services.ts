import PublicCarsService from "src/services/publicCars";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL as string;

export default {
  publicCars: new PublicCarsService(BASE_URL),
};

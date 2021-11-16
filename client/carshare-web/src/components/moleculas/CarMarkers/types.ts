import L from "leaflet";
import { ProviderWithCars } from "src/types/ProviderWithCars";

export interface ICarMarkersProps {
  providers: ProviderWithCars[];
  setWaypoints: React.Dispatch<React.SetStateAction<L.LatLng[]>>;
}

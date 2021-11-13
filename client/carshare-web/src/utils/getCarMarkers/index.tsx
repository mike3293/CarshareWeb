import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import CarInfoPopup from "src/components/moleculas/CarInfoPopup";
import { PublicCar } from "src/types/PublicCar";

const getCarMarkers = (cars: PublicCar[]) =>
  cars.map((c) =>
    L.marker(
      { lat: c.latPrecise ?? c.lat, lng: c.lonPrecise ?? c.lon },
      {
        icon: L.icon({
          iconUrl: c.provider.pinUrl,
          iconSize: [25, 35],
          shadowSize: [0, 0],
          iconAnchor: [12.5, 33],
          popupAnchor: [0, -33],
        }),
      }
    ).bindPopup(ReactDOMServer.renderToString(<CarInfoPopup car={c} />))
  );

export default getCarMarkers;

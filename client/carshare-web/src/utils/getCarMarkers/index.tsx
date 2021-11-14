import L from "leaflet";
import ReactDOMServer from "react-dom/server";
import CarInfoPopup from "src/components/moleculas/CarInfoPopup";
import { Car } from "src/types/Car";
import { ProviderWithCars } from "src/types/ProviderWithCars";

const getCarMarkers = (providers: ProviderWithCars[]) =>
  providers.flatMap((p) =>
    p.cars.map((c) =>
      L.marker(
        { lat: c.lat, lng: c.lon },
        {
          icon: L.icon({
            iconUrl: p.pinUrl,
            iconSize: [25, 35],
            shadowSize: [0, 0],
            iconAnchor: [12.5, 33],
            popupAnchor: [0, -33],
          }),
        }
      ).bindPopup(
        ReactDOMServer.renderToString(
          <CarInfoPopup car={c} providerLogoUrl={p.logoUrl} />
        )
      )
    )
  );

export default getCarMarkers;

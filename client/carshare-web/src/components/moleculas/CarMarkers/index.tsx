import L from "leaflet";
import CarInfoPopup from "src/components/moleculas/CarInfoPopup";
import { Marker } from "react-leaflet";
import { ICarMarkersProps } from "./types";
import React from "react";

function CarMarkers({ providers, setWaypoints }: ICarMarkersProps) {
  return (
    <>
      {providers.flatMap((p) =>
        p.cars.map((c) => (
          <Marker
            key={c.id}
            position={{ lat: c.lat, lng: c.lon }}
            icon={L.icon({
              iconUrl: p.pinUrl,
              iconSize: [25, 35],
              shadowSize: [0, 0],
              iconAnchor: [12.5, 33],
              popupAnchor: [0, -33],
            })}
          >
            <CarInfoPopup
              car={c}
              providerLogoUrl={p.logoUrl}
              setWaypoints={setWaypoints}
            />
          </Marker>
        ))
      )}
    </>
  );
}

export default React.memo(CarMarkers);

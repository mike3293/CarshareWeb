import React, { useMemo } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import VectorTileLayer from "react-leaflet-vector-tile-layer";
import { useQuery } from "react-query";
import { mapStyleUrl, mapFallbackLayerUrl } from "src/config/constants";
import services from "src/config/services";
import MarkerCluster from "src/components/moleculas/MarkerCluster";
import L from "leaflet";

L.Icon.Default.imagePath = "images/leaflet/";

const CarMap = () => {
  const { data = [], isLoading } = useQuery(
    "getPublicCars",
    () => services.publicCars.getCars(),
    { refetchInterval: false, refetchOnWindowFocus: false }
  );

  const markers = useMemo(
    () =>
      data.map((c) =>
        L.marker(
          { lat: c.lat, lng: c.lon },
          {
            icon: L.icon({
              iconUrl: c.provider.pinUrl,
              iconSize: [25, 35],
              shadowSize: [0, 0],
              iconAnchor: [0, 29],
            }),
          }
        )
      ),
    [data]
  );

  console.log(data);

  return (
    <MapContainer center={[53.893009, 27.567444]} zoom={13} maxZoom={19}>
      {mapStyleUrl ? (
        <VectorTileLayer styleUrl={mapStyleUrl} />
      ) : (
        <TileLayer url={mapFallbackLayerUrl} />
      )}
      <MarkerCluster markers={markers} />
    </MapContainer>
  );
};

export default CarMap;

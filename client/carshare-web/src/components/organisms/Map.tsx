import React, { useEffect, useMemo, useState } from "react";
import {
  AttributionControl,
  MapContainer,
  Marker,
  Pane,
  ScaleControl,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import VectorTileLayer from "react-leaflet-vector-tile-layer";
import { useQuery } from "react-query";
import {
  vectorMapStyleUrl,
  fallbackMapLayerUrl,
  vectorMapAttribution,
  fallbackMapAttribution,
} from "src/config/constants";
import services from "src/config/services";
import MarkerCluster from "src/components/moleculas/MarkerCluster";
import L, { LatLngExpression } from "leaflet";
import PersonPinCircleIcon from "@mui/icons-material/PersonPinCircle";
import CurrentPosition from "src/components/moleculas/CurrentPosition";
import FindCurrentPosition from "src/components/moleculas/FindCurrentPosition";
import { useMobile } from "src/hooks/useMedia";

L.Icon.Default.imagePath = "images/leaflet/";

const CarMap = () => {
  const isMobile = useMobile();
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression>();

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
              iconAnchor: [12.5, 33],
            }),
          }
        ).bindPopup(`${c.provider.name} ${c.model}`)
      ),
    [data]
  );

  console.log(data);

  return (
    <MapContainer
      center={[53.893009, 27.567444]}
      zoom={13}
      maxZoom={19}
      zoomControl={false}
    >
      {vectorMapStyleUrl ? (
        <VectorTileLayer
          styleUrl={vectorMapStyleUrl}
          attribution={vectorMapAttribution}
        />
      ) : (
        <TileLayer
          url={fallbackMapLayerUrl}
          attribution={fallbackMapAttribution}
        />
      )}
      {markers.length && <MarkerCluster markers={markers} />}
      {currentPosition && <CurrentPosition currentPosition={currentPosition} />}
      <FindCurrentPosition
        onPositionChange={setCurrentPosition}
        isMobile={isMobile}
      />
      {!isMobile && <ZoomControl position="bottomright" />}
    </MapContainer>
  );
};

export default CarMap;

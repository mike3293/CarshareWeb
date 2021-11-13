import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
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
import CurrentPosition from "src/components/moleculas/CurrentPosition";
import FindCurrentPosition from "src/components/moleculas/FindCurrentPosition";
import { useMobile } from "src/hooks/useMedia";
import getCarMarkers from "src/utils/getCarMarkers";

L.Icon.Default.imagePath = "images/leaflet/";

const CarMap = () => {
  const isMobile = useMobile();
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression>();

  const { data = [], isLoading } = useQuery(
    "getPublicCars",
    () => services.publicCars.getCars(),
    { refetchInterval: false, refetchOnWindowFocus: false }
  );

  const markers = useMemo(() => getCarMarkers(data), [data]);

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
      {!isMobile && <ZoomControl position="bottomright" />}
      {currentPosition && <CurrentPosition currentPosition={currentPosition} />}
      <FindCurrentPosition
        onPositionChange={setCurrentPosition}
        isMobile={isMobile}
      />
      {markers.length && <MarkerCluster markers={markers} />}
    </MapContainer>
  );
};

export default CarMap;

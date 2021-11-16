import React, { useEffect, useMemo, useRef, useState } from "react";
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
import MarkerClusterGroup from "react-leaflet-markercluster";
import L, { LatLngExpression, Marker } from "leaflet";
import CurrentPosition from "src/components/moleculas/CurrentPosition";
import FindCurrentPosition from "src/components/moleculas/FindCurrentPosition";
import { useMobile } from "src/hooks/useMedia";
import CarFilters from "../moleculas/CarFilters";
import { useFiltersStore } from "src/context/filtersStore";
import { useDebounce } from "src/hooks/useDebounce";
import DirectionsIcon from "@mui/icons-material/Directions";
import RoutingMachine from "../moleculas/RoutingMachine";
import CarMarkers from "../moleculas/CarMarkers";

L.Icon.Default.imagePath = "images/leaflet/";

const CarMap = () => {
  const isMobile = useMobile();
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression>();

  const { selectedProviderIds, selectedFuelLevel } = useFiltersStore();
  const debouncedSelectedProviderIds = useDebounce(selectedProviderIds, 1000);

  const { data = [], isLoading } = useQuery(
    [
      "getPublicCars",
      debouncedSelectedProviderIds.join(","),
      selectedFuelLevel,
    ],
    () =>
      services.publicCars.getCars(
        debouncedSelectedProviderIds,
        selectedFuelLevel
      ),
    { refetchOnWindowFocus: false }
  );

  console.log(data);

  const routingMachine = useRef<L.Routing.Control>(null);

  const [waypoints, setWaypoints] = useState<L.LatLng[]>([]);

  useEffect(() => {
    if (routingMachine.current) {
      routingMachine.current.setWaypoints(waypoints);
    }
  }, [waypoints, routingMachine]);

  return (
    <MapContainer
      center={[53.893009, 27.567444]}
      zoom={13}
      maxZoom={19}
      zoomControl={false}
    >
      {!isMobile && vectorMapStyleUrl ? (
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
      <MarkerClusterGroup
        showCoverageOnHover={false}
        maxClusterRadius={50}
        disableClusteringAtZoom={15}
        spiderfyOnMaxZoom={false}
      >
        <CarMarkers providers={data} setWaypoints={setWaypoints} />
      </MarkerClusterGroup>
      <CarFilters isMobile={isMobile} />
      <RoutingMachine ref={routingMachine} waypoints={waypoints} />
    </MapContainer>
  );
};

export default CarMap;

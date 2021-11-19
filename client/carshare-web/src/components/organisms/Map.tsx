import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AttributionControl,
  MapContainer,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import VectorTileLayer from "react-leaflet-vector-tile-layer";
import { useQuery } from "react-query";
import shallow from "zustand/shallow";
import {
  vectorMapStyleUrl,
  fallbackMapLayerUrl,
  vectorMapAttribution,
  fallbackMapAttribution,
} from "src/config/constants";
import services from "src/config/services";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L, { LatLngExpression, LatLng } from "leaflet";
import CurrentPosition from "src/components/moleculas/CurrentPosition";
import FindCurrentPosition from "src/components/moleculas/FindCurrentPosition";
import { useMobile } from "src/hooks/useMedia";
import CarFilters from "../moleculas/CarFilters";
import { useFiltersStore } from "src/context/filtersStore";
import { getHasWaypoints, useRoutingStore } from "src/context/routingStore";
import { useDebounce } from "src/hooks/useDebounce";
import RoutingMachine from "../moleculas/RoutingMachine";
import CarMarkers from "../moleculas/CarMarkers";
import Routing from "../moleculas/Routing";

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

  const routingMachineRef = useRef<L.Routing.Control>(null);

  const [waypoints, hasWaypoints, setRawWaypoints] = useRoutingStore(
    (s) => [s.waypoints, getHasWaypoints(s), s.setRawWaypoints],
    shallow
  );

  const refreshWaypoints = useCallback(() => {
    if (routingMachineRef.current) {
      const machineWaypoints = routingMachineRef.current.getWaypoints();

      setRawWaypoints(machineWaypoints);
    }
  }, [setRawWaypoints, routingMachineRef]);

  useEffect(() => {
    if (routingMachineRef.current) {
      routingMachineRef.current.setWaypoints(waypoints);
    }
  }, [waypoints, routingMachineRef]);

  return (
    <MapContainer
      center={[53.893009, 27.567444]}
      zoom={13}
      minZoom={4}
      maxZoom={18}
      zoomControl={false}
      attributionControl={false}
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
      <AttributionControl position="bottomleft" />
      {!isMobile && <ZoomControl position="bottomright" />}
      {currentPosition && <CurrentPosition currentPosition={currentPosition} />}
      <FindCurrentPosition
        onPositionChange={setCurrentPosition}
        isMobile={isMobile}
      />
      {!hasWaypoints && routingMachineRef.current && (
        <MarkerClusterGroup
          showCoverageOnHover={false}
          maxClusterRadius={50}
          disableClusteringAtZoom={15}
          spiderfyOnMaxZoom={false}
        >
          <CarMarkers providers={data} />
        </MarkerClusterGroup>
      )}
      {!hasWaypoints && <CarFilters isMobile={isMobile} />}
      <RoutingMachine
        ref={routingMachineRef}
        refreshWaypoints={refreshWaypoints}
      />
      {hasWaypoints && routingMachineRef.current && (
        <Routing routingMachine={routingMachineRef.current} />
      )}
    </MapContainer>
  );
};

export default CarMap;

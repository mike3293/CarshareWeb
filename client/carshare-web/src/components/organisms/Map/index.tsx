import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AttributionControl,
  MapContainer,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import VectorTileLayer from "react-leaflet-vector-tile-layer";
import { useQuery } from "react-query";
import shallow from "zustand/shallow";
import constants from "src/config/constants";
import services from "src/config/services";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L, { LatLngExpression } from "leaflet";
import CurrentPosition from "src/components/moleculas/CurrentPosition";
import FindCurrentPosition from "src/components/moleculas/FindCurrentPosition";
import { useMobile } from "src/hooks/useMedia";
import CarFilters from "../../moleculas/CarFilters";
import { useFiltersStore } from "src/context/filtersStore";
import {
  getHasCarsToCompare,
  getHasWaypoints,
  useRoutingStore,
} from "src/context/routingStore";
import { useDebounce } from "src/hooks/useDebounce";
import RoutingMachine from "../../moleculas/RoutingMachine";
import CarMarkers from "../../moleculas/CarMarkers";
import Routing from "../../moleculas/Routing";
import { useUserStore } from "src/context/userStore";
import { Policy, usePolicy } from "src/hooks/usePolicy";
import AdminPanelLink from "../../moleculas/AdminPanelLink";
import { LinearProgress } from "@mui/material";
import RefreshCars from "src/components/moleculas/RefreshCars";
import CarsToCompare from "src/components/moleculas/CarsToCompare";
import MapToolbar from "src/components/moleculas/MapToolbar";
import UserConfigurationPanelLink from "src/components/moleculas/UserConfigurationPanelLink";

L.Icon.Default.imagePath = "images/leaflet/";

const CarMap = () => {
  const isMobile = useMobile();
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression>();

  const { selectedProviderIds, selectedFuelLevel } = useFiltersStore();
  const debouncedSelectedProviderIds = useDebounce(selectedProviderIds, 1000);

  const {
    data = [],
    refetch,
    isFetching,
  } = useQuery(
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

  const [
    waypoints,
    hasWaypoints,
    setRawWaypoints,
    hasCarsToCompare,
    clearCarsToCompare,
  ] = useRoutingStore(
    (s) => [
      s.waypoints,
      getHasWaypoints(s),
      s.setRawWaypoints,
      getHasCarsToCompare(s),
      s.clearCarsToCompare,
    ],
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

  useEffect(() => {
    clearCarsToCompare();
  }, []);

  const role = useUserStore((s) => s.role);

  const haveAccessToConfiguration = usePolicy(Policy.CanManageConfiguration, {
    role,
  });

  return (
    <>
      {isFetching && (
        <LinearProgress
          sx={{ position: "absolute", zIndex: 900, top: 0, left: 0, right: 0 }}
        />
      )}
      <MapContainer
        center={[53.893009, 27.567444]}
        zoom={12}
        minZoom={4}
        maxZoom={18}
        zoomControl={false}
        attributionControl={false}
      >
        {isMobile ? (
          <TileLayer
            url={constants.FALLBACK_MAP_LAYER_URL}
            attribution={constants.FALLBACK_MAP_ATTRIBUTION}
          />
        ) : (
          <VectorTileLayer
            styleUrl={constants.VECTOR_MAP_STYLE_URL}
            attribution={constants.VECTOR_MAP_ATTRIBUTION}
          />
        )}
        <AttributionControl position="bottomleft" />
        {currentPosition && (
          <CurrentPosition currentPosition={currentPosition} />
        )}
        <MapToolbar position="top" isMobile={isMobile}>
          {!hasWaypoints && haveAccessToConfiguration && <AdminPanelLink />}
          {!hasWaypoints && role && <UserConfigurationPanelLink />}
        </MapToolbar>
        <MapToolbar position="bottom" isMobile={isMobile}>
          {!hasWaypoints && <RefreshCars refresh={refetch} />}
          {!hasWaypoints && <CarFilters />}
          <FindCurrentPosition onPositionChange={setCurrentPosition} />
        </MapToolbar>
        {!isMobile && <ZoomControl position="bottomright" />}
        <RoutingMachine
          ref={routingMachineRef}
          refreshWaypoints={refreshWaypoints}
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
        {!hasWaypoints && hasCarsToCompare && <CarsToCompare />}
        {hasWaypoints && routingMachineRef.current && (
          <Routing routingMachine={routingMachineRef.current} />
        )}
      </MapContainer>
    </>
  );
};

export default CarMap;

import type { NextPage } from "next";
import React from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import VectorTileLayer from "react-leaflet-vector-tile-layer";
import { useQuery } from "react-query";
import { mapStyleUrl, mapFallbackLayerUrl } from "src/config/constants";
import services from "src/config/services";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
L.Icon.Default.imagePath = "images/leaflet/";

const Home = () => {
  const { data = [], isLoading } = useQuery(
    "getPublicCars",
    () => services.publicCars.getCars(),
    { refetchInterval: false, refetchOnWindowFocus: false }
  );

  console.log(data);

  return (
    <MapContainer center={[53.893009, 27.567444]} zoom={13}>
      {mapStyleUrl ? (
        <VectorTileLayer styleUrl={mapStyleUrl} />
      ) : (
        <TileLayer url={mapFallbackLayerUrl} />
      )}
      <MarkerClusterGroup showCoverageOnHover={false} maxClusterRadius={50}>
        {data.map((c) => (
          <Marker key={c.id} position={{ lat: c.lat, lng: c.lon }} />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default Home;

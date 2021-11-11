import type { NextPage } from "next";
import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import VectorTileLayer from "react-leaflet-vector-tile-layer";
import { mapStyleUrl, mapFallbackLayerUrl } from "src/config/constants";

const Home: NextPage = () => {
  return (
    <div>
      <MapContainer center={[53.893009, 27.567444]} zoom={13}>
        {mapStyleUrl ? (
          <VectorTileLayer styleUrl={mapStyleUrl} />
        ) : (
          <TileLayer url={mapFallbackLayerUrl} />
        )}
      </MapContainer>
    </div>
  );
};

export default Home;

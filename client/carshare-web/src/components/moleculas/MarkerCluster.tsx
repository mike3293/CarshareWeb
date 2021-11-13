import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { Marker } from "leaflet";
import "leaflet.markercluster";

interface IMarkerClusterProps {
  markers: Marker[];
}

const cluster = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 50,
  disableClusteringAtZoom: 15,
  spiderfyOnMaxZoom: false,
});

const MarkerCluster = ({ markers }: IMarkerClusterProps) => {
  const map = useMap();

  useEffect(() => {
    cluster.clearLayers();
    cluster.addLayers(markers);
    map.addLayer(cluster);
  }, [map, markers]);

  return null;
};

export default MarkerCluster;

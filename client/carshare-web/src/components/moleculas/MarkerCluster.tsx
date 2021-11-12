import { PropsWithChildren, useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { Marker } from "leaflet";
import "leaflet.markercluster";

interface IMarkerClusterProps {
  markers: Marker[];
}

const cluster = L.markerClusterGroup({
  showCoverageOnHover: false,
  maxClusterRadius: 50,
});

const MarkerCluster = ({ markers }: IMarkerClusterProps) => {
  const map = useMap();

  useEffect(() => {
    cluster.clearLayers();
    cluster.addLayers(markers);
    map.addLayer(cluster);

    // map.on("zoomend", function () {
    //   cluster.clearLayers();
    //   cluster.addLayers(markers);
    // });
  }, [map, markers]);

  return null;
};

export default MarkerCluster;

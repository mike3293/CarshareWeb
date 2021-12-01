import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useMap, Marker } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import MapButton from "src/components/atoms/MapButton";
import MyLocationIcon from "@mui/icons-material/MyLocation";
interface IFindCurrentPositionProps {
  onPositionChange: (position: LatLngExpression) => void;
  isMobile: boolean;
}

const FindCurrentPosition = ({
  onPositionChange,
  isMobile,
}: IFindCurrentPositionProps) => {
  const map = useMap();

  const zoomToCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        onPositionChange(coords);
        map.setView(coords, 15);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <MapButton
      onClick={zoomToCurrentPosition}
      color="primary"
      sx={{
        right: isMobile ? 8 : 11,
        bottom: isMobile ? 55 : 100,
      }}
    >
      <MyLocationIcon />
    </MapButton>
  );
};

export default FindCurrentPosition;

import { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { useMap, Marker } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { IconButton } from "@mui/material";
import ExploreIcon from "@mui/icons-material/Explore";

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
        map.flyTo(coords, 15);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(zoomToCurrentPosition, [map]);

  return (
    <IconButton
      onClick={zoomToCurrentPosition}
      color="primary"
      sx={{
        position: "absolute",
        zIndex: 1000,
        right: isMobile ? 0 : 7,
        bottom: isMobile ? 15 : 100,
      }}
    >
      <ExploreIcon />
    </IconButton>
  );
};

export default FindCurrentPosition;

import { useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import MapButton from "src/components/atoms/MapButton";
import MyLocationIcon from "@mui/icons-material/MyLocation";
interface IFindCurrentPositionProps {
  onPositionChange: (position: LatLngExpression) => void;
}

const FindCurrentPosition = ({
  onPositionChange,
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
    <MapButton onClick={zoomToCurrentPosition} color="primary">
      <MyLocationIcon />
    </MapButton>
  );
};

export default FindCurrentPosition;

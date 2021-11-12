import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import MyLocationIcon from "@mui/icons-material/MyLocation";

interface ICurrentPositionProps {
  currentPosition: LatLngExpression;
}

const CurrentPosition = ({ currentPosition }: ICurrentPositionProps) => (
  <Marker
    position={currentPosition}
    icon={L.divIcon({
      className: "custom-icon",
      iconAnchor: [12, 12],
      html: ReactDOMServer.renderToString(
        <MyLocationIcon sx={{ color: "info.light" }} />
      ),
    })}
  />
);

export default CurrentPosition;

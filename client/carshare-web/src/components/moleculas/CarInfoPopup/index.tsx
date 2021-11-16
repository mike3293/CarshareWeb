import { styled, Typography } from "@mui/material";
import L from "leaflet";
import { Popup } from "react-leaflet";
import { Car } from "src/types/Car";

interface ICarInfoPopupProps {
  car: Car;
  providerLogoUrl: string;
  setWaypoints: React.Dispatch<React.SetStateAction<L.LatLng[]>>;
}

const Root = styled("div")(({ theme }) => ({
  display: "grid",
  textAlign: "center",
  minWidth: theme.spacing(20),
  fontFamily: theme.typography.fontFamily,
}));

const CarImageContainer = styled("div")(({ theme }) => ({
  height: theme.spacing(13),
  display: "flex",
}));

const CarImage = styled("img")(({ theme }) => ({
  width: theme.spacing(19),
  margin: "auto",
}));

const ProviderImage = styled("img")(({ theme }) => ({
  height: theme.spacing(4),
}));

const CarInfoPopup = ({
  car,
  providerLogoUrl,
  setWaypoints,
}: ICarInfoPopupProps) => {
  return (
    <Popup>
      <Root>
        <ProviderImage
          src={providerLogoUrl}
          onClick={() => {
            setWaypoints((oldValue) => [
              ...oldValue,
              L.latLng({ lat: car.lat, lng: car.lon }),
            ]);
          }}
        />
        <CarImageContainer>
          {car.imageUrl && (
            <CarImage src={car.imageUrl} onClick={() => alert("s")} />
          )}
        </CarImageContainer>
        <Typography component="div" variant="body2" gutterBottom>
          {car.reg}
        </Typography>
        <Typography variant="h6">{car.model}</Typography>
        <Typography component="div">Топливо: {car.fuel}%</Typography>
      </Root>
    </Popup>
  );
};

export default CarInfoPopup;

import { Button, styled, Typography } from "@mui/material";
import L from "leaflet";
import { Popup } from "react-leaflet";
import DirectionsIcon from "@mui/icons-material/Directions";
import { Car } from "src/types/Car";
import { useRoutingStore } from "src/context/routingStore";

interface ICarInfoPopupProps {
  car: Car;
  providerId: string;
  providerLogoUrl: string;
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
  providerId,
  providerLogoUrl,
}: ICarInfoPopupProps) => {
  const addCarWaypoint = useRoutingStore((s) => s.addCarWaypoint);

  return (
    <Popup>
      <Root>
        <ProviderImage src={providerLogoUrl} />
        <CarImageContainer>
          {car.imageUrl && <CarImage src={car.imageUrl} />}
        </CarImageContainer>
        <Typography component="div" variant="body2" gutterBottom>
          {car.reg}
        </Typography>
        <Typography variant="h6">{car.model}</Typography>
        <Typography component="div">Топливо: {car.fuel}%</Typography>
        <Button
          color="secondary"
          onClick={() => addCarWaypoint(car, providerId)}
        >
          маршрут
          <DirectionsIcon sx={{ ml: 0.5 }} />
        </Button>
      </Root>
    </Popup>
  );
};

export default CarInfoPopup;

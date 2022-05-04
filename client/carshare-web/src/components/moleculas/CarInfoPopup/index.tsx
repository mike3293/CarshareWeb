import { Button, styled, Tooltip, Typography } from "@mui/material";
import { Popup } from "react-leaflet";
import DirectionsIcon from "@mui/icons-material/Directions";
import CompareIcon from "@mui/icons-material/Compare";
import { Car } from "src/types/Car";
import { useRoutingStore } from "src/context/routingStore";
import shallow from "zustand/shallow";

interface ICarInfoPopupProps {
  car: Car;
  providerId: string;
  providerName: string;
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

const Actions = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-around",
}));

const CarInfoPopup = ({
  car,
  providerId,
  providerName,
  providerLogoUrl,
}: ICarInfoPopupProps) => {
  const [startRouteWithCar, addToCarsToCompare] = useRoutingStore(
    (s) => [s.startRouteWithCar, s.addCarToComparison],
    shallow
  );

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
        <Actions>
          <Tooltip title="Построить маршрут" placement="top">
            <Button
              color="secondary"
              onClick={() => {
                addToCarsToCompare(car, providerId, providerName);
                startRouteWithCar(car.id);
              }}
            >
              <DirectionsIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Выбрать для сравнения" placement="top">
            <Button
              color="primary"
              onClick={() => addToCarsToCompare(car, providerId, providerName)}
            >
              <CompareIcon />
            </Button>
          </Tooltip>
        </Actions>
      </Root>
    </Popup>
  );
};

export default CarInfoPopup;

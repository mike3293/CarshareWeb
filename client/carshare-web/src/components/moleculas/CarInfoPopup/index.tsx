import { styled, Typography } from "@mui/material";
import { Car } from "src/types/Car";

interface ICarInfoPopupProps {
  car: Car;
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

const CarInfoPopup = ({ car, providerLogoUrl }: ICarInfoPopupProps) => (
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
  </Root>
);

export default CarInfoPopup;

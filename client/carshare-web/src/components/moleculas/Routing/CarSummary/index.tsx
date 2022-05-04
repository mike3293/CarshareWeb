import { styled, Typography } from "@mui/material";
import React from "react";
import { Car } from "src/types/Car";

const Root = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gap: theme.spacing(2),
  alignItems: "center",
}));

const CarImage = styled("img")(({ theme }) => ({
  height: theme.spacing(6),
}));

const CarSummary = ({ car }: { car: Car }) => (
  <Root>
    <CarImage src={car.imageUrl} />
    <div>
      <Typography>{car.reg}</Typography>
      <Typography>{car.fuel}%</Typography>
    </div>
  </Root>
);

export default CarSummary;

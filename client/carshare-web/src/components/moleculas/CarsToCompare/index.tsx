import { useMobile } from "src/hooks/useMedia";
import {
  Button,
  Dialog,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { ReactChild, useMemo } from "react";
import { groupBy, last, map, orderBy } from "lodash";
import shallow from "zustand/shallow";
import { useRoutingStore } from "src/context/routingStore";
import { red } from "@mui/material/colors";
import CloseIcon from "@mui/icons-material/HighlightOff";
import DirectionsIcon from "@mui/icons-material/Directions";

const CarsToCompare = () => {
  const isMobile = useMobile();

  const [carsToCompare, removeCarFromComparison, startRouteWithCar] =
    useRoutingStore(
      (s) => [s.carsToCompare, s.removeCarFromComparison, s.startRouteWithCar],
      shallow
    );

  const sortedCars = useMemo(
    () => orderBy(carsToCompare, ["providerName", "model"]),
    [carsToCompare]
  );

  const groupedCars = useMemo(
    () => groupBy(sortedCars, (c) => c.providerName),
    [sortedCars]
  );

  const elementsArray = useMemo(() => {
    const elements: ReactChild[] = [];

    map(groupedCars, (cars, providerName) => {
      elements.push(
        <ListSubheader
          sx={{ lineHeight: "30px" }}
          color="primary"
          key={providerName}
        >
          {providerName}
        </ListSubheader>
      );
      map(cars, (c) => {
        elements.push(
          <ListItem
            key={c.id}
            sx={{ py: 0 }}
            secondaryAction={
              <IconButton
                sx={{
                  ml: 0.5,
                  p: 0.25,
                  color: red[200],
                  "&:hover": {
                    color: red[400],
                  },
                }}
                onClick={() => removeCarFromComparison(c.id)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemText
              sx={{ ml: 1.5 }}
              primary={c.model}
              secondary={`${c.reg} | ${c.fuel}%`}
            />
          </ListItem>
        );
      });
    });

    return elements;
  }, [groupedCars]);

  return (
    <Dialog
      open={true}
      sx={{ pointerEvents: "none" }}
      PaperProps={{
        sx: {
          pointerEvents: "auto",
          top: 0,
          left: 0,
          position: "absolute",
          m: 1,
          borderRadius: 2,
          // tmp
          minWidth: 210,
          maxHeight: isMobile ? 300 : 500,
        },
      }}
      hideBackdrop
    >
      <Button
        sx={{ pt: 1.5 }}
        color="secondary"
        onClick={() => startRouteWithCar(last(carsToCompare)!.id)}
      >
        Маршрут
        <DirectionsIcon />
      </Button>
      <List sx={{ pt: 0 }}>{elementsArray}</List>
    </Dialog>
  );
};

export default CarsToCompare;

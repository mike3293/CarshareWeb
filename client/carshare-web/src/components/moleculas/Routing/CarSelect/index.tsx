import { ListItemText, ListSubheader, MenuItem, Select } from "@mui/material";
import { groupBy, orderBy, map } from "lodash";
import React, { ReactChild, useMemo } from "react";
import { useRoutingStore } from "src/context/routingStore";
import shallow from "zustand/shallow";
import ModelWithPrice from "./ModelWithPrice";

const CarSelect = () => {
  const [selectedCar, carsToCompare, startRouteWithCar] = useRoutingStore(
    (s) => [s.selectedCar, s.carsToCompare, s.startRouteWithCar],
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
          <MenuItem key={c.id} value={c.id}>
            <ListItemText
              sx={{ ml: 1.5 }}
              primary={<ModelWithPrice car={c} />}
              secondary={`${c.reg} | ${c.fuel}%`}
            />
          </MenuItem>
        );
      });
    });

    return elements;
  }, [groupedCars]);

  return (
    <Select
      sx={{ "& .MuiSelect-select": { pt: 1, pb: 1 } }}
      value={selectedCar?.id}
      onChange={(e) => startRouteWithCar(e.target.value)}
      renderValue={(id) => {
        const car = carsToCompare.find((c) => c.id === id)!;

        return `${car.providerName} - ${car.model}`;
      }}
      MenuProps={{
        sx: { maxHeight: 350 },
      }}
    >
      {elementsArray}
    </Select>
  );
};

export default CarSelect;

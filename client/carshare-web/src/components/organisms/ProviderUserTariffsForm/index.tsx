import { useDebounce } from "src/hooks/useDebounce";
import {
  CarPriceWithProviderId,
  ProviderWithTarrifs,
} from "src/services/configuration/types";
import { useMemo, useState } from "react";
import { keyBy, orderBy } from "lodash";
import { styled, TextField } from "@mui/material";
import CarOverridesForm from "./CarOverridesForm";

const Root = styled("div")(({ theme }) => ({
  display: "grid",
  gridAutoFlow: "row",
  gap: theme.spacing(4),
}));

interface IProviderUserTariffsFormProps {
  provider: ProviderWithTarrifs;
  overrides?: CarPriceWithProviderId[];
}

const ProviderUserTariffsForm = ({
  provider: { id, carPrices },
  overrides,
}: IProviderUserTariffsFormProps) => {
  const [search, setSearch] = useState("");

  const debouncedSearh = useDebounce(search, 500);

  const filteredCars = useMemo(
    () =>
      orderBy(
        carPrices.filter((c) =>
          c.model.toLowerCase().includes(debouncedSearh.toLowerCase())
        ),
        ["brand", "model"]
      ),
    [carPrices, debouncedSearh]
  );

  const overridesMap = useMemo(
    () => keyBy(overrides, (o) => o.model),
    [overrides]
  );

  return (
    <Root>
      <TextField
        sx={{ maxWidth: 300 }}
        label="Поиск"
        variant="standard"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredCars.map((c) => (
        <CarOverridesForm
          key={c.model}
          car={c}
          providerId={id}
          packageTariffOverrides={overridesMap[c.model]?.packageTariffs}
        />
      ))}
    </Root>
  );
};

export default ProviderUserTariffsForm;

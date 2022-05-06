import { useMemo, useState } from "react";
import { orderBy } from "lodash";
import TariffsGrid from "../../moleculas/TariffsGrid";
import { Paper, styled, TextField, Typography } from "@mui/material";
import { useDebounce } from "src/hooks/useDebounce";
import { ProviderWithTarrifs } from "src/services/configuration/types";
import services from "src/config/services";

const Root = styled("div")(({ theme }) => ({
  display: "grid",
  gridAutoFlow: "row",
  gap: theme.spacing(4),
}));

const CarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderWidth: "3px",
}));

interface IProviderTarrifsFormProps {
  provider: ProviderWithTarrifs;
}

const ProviderTarrifsForm = ({
  provider: { id, carPrices },
}: IProviderTarrifsFormProps) => {
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
        <CarContainer key={c.model} variant="outlined">
          <Typography sx={{ mb: 1 }}>{c.model}</Typography>
          <TariffsGrid
            packageTariffs={c.packageTariffs}
            updateTariffs={(tariffs) =>
              services.configuration.updateTariffs(id, c.model, tariffs)
            }
          />
        </CarContainer>
      ))}
    </Root>
  );
};

export default ProviderTarrifsForm;

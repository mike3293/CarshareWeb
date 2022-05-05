import { ProviderWithTarrifs } from "src/types/ProviderWithTarrifs";
import { useMemo } from "react";
import { orderBy } from "lodash";
import TariffsGrid from "./TariffsGrid";
import { Paper, styled, Typography } from "@mui/material";

const Root = styled("div")(({ theme }) => ({
  display: "grid",
  gridAutoFlow: "row",
  gap: theme.spacing(4),
}));

const CarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderWidth: "3px",
}));

const ProviderTarrifsForm = ({
  provider: { carPrices, id },
  disabled = false,
}: {
  disabled?: boolean;
  provider: ProviderWithTarrifs;
}) => {
  const orderedCars = useMemo(
    () => orderBy(carPrices, (c) => c.brand),
    [carPrices]
  );

  return (
    <Root>
      {orderedCars.map((c) => (
        <CarContainer key={c.model} variant="outlined">
          <Typography sx={{ mb: 1 }}>{c.model}</Typography>
          <TariffsGrid car={c} providerId={id} disabled={disabled} />
        </CarContainer>
      ))}
    </Root>
  );
};

export default ProviderTarrifsForm;

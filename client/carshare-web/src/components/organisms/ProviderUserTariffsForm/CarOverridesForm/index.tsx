import { useDebounce } from "src/hooks/useDebounce";
import {
  CarPrice,
  CarPriceWithProviderId,
  PackageTariff,
  ProviderWithTarrifs,
  TariffOverride,
} from "src/services/configuration/types";
import { useEffect, useMemo, useState } from "react";
import { groupBy, keyBy, orderBy } from "lodash";
import {
  Box,
  CircularProgress,
  Paper,
  styled,
  Switch,
  Typography,
} from "@mui/material";
import services from "src/config/services";
import TariffsGrid from "src/components/moleculas/TariffsGrid";
import useOnDidUpdate from "src/hooks/useOnDidUpdate";
import { useMutation, useQueryClient } from "react-query";

const CarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderWidth: "3px",
}));

const OverrideHeader = styled("div")(({ theme }) => ({
  borderTop: "solid gray",
  borderColor: theme.palette.grey[300],
  marginTop: theme.spacing(2.5),
  paddingTop: theme.spacing(1.5),
  marginBottom: theme.spacing(0.5),
}));

const CarHeader = styled("div")(({ theme }) => ({
  marginTop: theme.spacing(-0.5),
  marginBottom: theme.spacing(1),
}));

interface ICarOverridesFormProps {
  car: CarPrice;
  providerId: string;
  packageTariffOverrides?: PackageTariff[];
}

const CarOverridesForm = ({
  providerId,
  car: { packageTariffs, model },
  packageTariffOverrides,
}: ICarOverridesFormProps) => {
  const [checked, setChecked] = useState(!!packageTariffOverrides);

  const queryClient = useQueryClient();

  const { mutate: createOverride, isLoading: isCreatingOverride } = useMutation<
    void,
    Error,
    { providerId: string; model: string; tariffs: PackageTariff[] }
  >(
    ({ providerId, model, tariffs }) =>
      services.configuration.createTariffOverride(providerId, model, tariffs),
    {
      onSuccess: (_, variables) => {
        const queryData: TariffOverride = {
          ...queryClient.getQueryData("getTariffOverrides")!,
        };

        queryData.carPrices = [
          ...queryData.carPrices,
          {
            model: variables.model,
            providerId: variables.providerId,
            packageTariffs: variables.tariffs,
          },
        ];

        queryClient.setQueryData("getTariffOverrides", queryData);
      },
    }
  );

  const { mutate: removeOverride, isLoading: isRemovingOverride } = useMutation<
    void,
    Error,
    { providerId: string; model: string }
  >(
    ({ providerId, model }) =>
      services.configuration.removeTariffOverride(providerId, model),
    {
      onSuccess: (_, variables) => {
        const queryData: TariffOverride = {
          ...queryClient.getQueryData("getTariffOverrides")!,
        };

        console.log("queryData", queryData);

        queryData.carPrices = queryData.carPrices.filter(
          (c) =>
            !(
              c.model === variables.model &&
              c.providerId === variables.providerId
            )
        );

        console.log("variables", variables);
        console.log("queryDataO", queryData);

        queryClient.setQueryData("getTariffOverrides", queryData);
      },
    }
  );

  useOnDidUpdate(() => {
    if (checked) {
      createOverride({ providerId, model, tariffs: packageTariffs });
    } else {
      removeOverride({ providerId, model });
    }
  }, [checked]);

  const isMutating = isRemovingOverride || isCreatingOverride;

  return (
    <CarContainer key={model} variant="outlined">
      <CarHeader>
        <Typography>{model}</Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography fontSize={14}>Использовать личные тарифы</Typography>
          <Switch
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            disabled={isMutating}
          />
        </Box>
      </CarHeader>
      <TariffsGrid packageTariffs={packageTariffs} />
      {packageTariffOverrides && (
        <>
          <OverrideHeader>
            <Typography>Личные тарифы для {model}</Typography>
          </OverrideHeader>
          <TariffsGrid
            packageTariffs={packageTariffOverrides}
            updateTariffs={(tariffs) =>
              services.configuration.updateTariffOverride(
                providerId,
                model,
                tariffs
              )
            }
          />
        </>
      )}
    </CarContainer>
  );
};

export default CarOverridesForm;

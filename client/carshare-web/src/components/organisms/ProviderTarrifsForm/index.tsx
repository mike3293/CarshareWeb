import { IconButtonProps, styled, Typography } from "@mui/material";
import { Button, Box } from "@mui/material";
import { Formik, Form } from "formik";
import { ProviderWithTarrifs } from "src/types/ProviderWithTarrifs";
import * as Yup from "yup";
import { ProviderTarrifsFormValues } from "./types";
import FormTextField from "./FormTextField";
import { useMemo } from "react";
import { orderBy } from "lodash";
import services from "src/config/services";

const providerTarrifsSchema: Yup.SchemaOf<ProviderTarrifsFormValues> =
  Yup.object().shape({
    carsTarrifs: Yup.array()
      .of(
        Yup.object().shape({
          model: Yup.string().required(),
          brand: Yup.string(),
          perMinCost: Yup.number()
            .typeError("Значение должно быть числом")
            .nullable()
            .min(0, "Значение должно быть больше нуля")
            .required("Обязательное поле"),
          perMinParkingCost: Yup.number()
            .nullable()
            .typeError("Значение должно быть числом")
            .min(0, "Значение должно быть больше нуля")
            .required("Обязательное поле"),
        })
      )
      .required(),
  });

const StyledForm = styled(Form)(({ theme }) => ({
  display: "grid",
  gridAutoFlow: "row",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
}));

const FormItem = styled("div")(({ theme }) => ({
  display: "grid",
  gridAutoFlow: "row",
  gap: theme.spacing(1),
}));

const FormFields = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: theme.spacing(2),
}));

const ProviderTarrifsForm = ({
  provider: { carPrices, id },
}: {
  provider: ProviderWithTarrifs;
}) => {
  const orderedPrices = useMemo(
    () => orderBy(carPrices, (c) => c.brand),
    [carPrices]
  );

  return (
    <Formik<ProviderTarrifsFormValues>
      validationSchema={providerTarrifsSchema}
      initialValues={{
        carsTarrifs: orderedPrices.map((c) => ({
          model: c.model,
          perMinCost: c.perMinCost,
          perMinParkingCost: c.perMinParkingCost,
        })),
      }}
      onSubmit={async (values) => {
        console.log(values);
        const carPrices = values.carsTarrifs.map(
          ({ perMinCost, perMinParkingCost, brand, model }) => ({
            perMinCost,
            perMinParkingCost,
            brand,
            model,
          })
        );

        await services.configuration.updateTarrifs(id, carPrices);
      }}
    >
      {({ values, isSubmitting }) => (
        <StyledForm>
          {values.carsTarrifs.map((ct, i) => (
            <FormItem key={ct.model}>
              <Typography>{ct.model}</Typography>
              <FormFields>
                <FormTextField
                  label="В минуту"
                  name={`carsTarrifs.${i}.perMinCost`}
                  variant="filled"
                />
                <FormTextField
                  label="Стоянка в минуту"
                  name={`carsTarrifs.${i}.perMinParkingCost`}
                  variant="filled"
                />
              </FormFields>
            </FormItem>
          ))}
          <Button
            variant="contained"
            type="submit"
            sx={{ width: "30%", minWidth: 156 }}
            disabled={isSubmitting}
          >
            Сохранить
          </Button>
        </StyledForm>
      )}
    </Formik>
  );
};

export default ProviderTarrifsForm;

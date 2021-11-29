import { IconButtonProps, styled } from "@mui/material";
import { Button, Box } from "@mui/material";
import { Formik } from "formik";
import { ProviderWithTarrifs } from "src/types/ProviderWithTarrifs";
import * as Yup from "yup";
import { ProviderTarrifsFormValues } from "./types";
import FormTextField from "./FormTextField";

const providerTarrifsSchema: Yup.SchemaOf<ProviderTarrifsFormValues> =
  Yup.object().shape({
    carsTarrifs: Yup.array()
      .of(
        Yup.object().shape({
          model: Yup.string().required(),
          brand: Yup.string(),
          perMinCost: Yup.number().required("Обязательное поле"),
          perMinParkingCost: Yup.number().required("Обязательное поле"),
        })
      )
      .required(),
  });

const Form = styled("form")(({ theme }) => ({
  display: "grid",
  gridAutoFlow: "column",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
}));

const ProviderTarrifsForm = ({
  provider,
}: {
  provider: ProviderWithTarrifs;
}) => {
  return (
    <Formik<ProviderTarrifsFormValues>
      validationSchema={providerTarrifsSchema}
      initialValues={{
        carsTarrifs: provider.carPrices.map((c) => ({
          model: c.model,
          perMinCost: c.perMinCost,
          perMinParkingCost: c.perMinParkingCost,
        })),
      }}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ values }) => (
        <Form>
          {values.carsTarrifs.map((ct, i) => (
            <Box key={ct.model}>
              <FormTextField name={`perMinCost.${i}`} type="number" />
              <FormTextField name={`perMinParkingCost.${i}`} type="number" />
            </Box>
          ))}
          <Button variant="contained" type="submit">
            Сохранить
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ProviderTarrifsForm;

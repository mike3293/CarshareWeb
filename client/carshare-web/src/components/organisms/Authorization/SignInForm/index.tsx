import { IconButtonProps, styled } from "@mui/material";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const signInSchema = Yup.object().shape({
  email: Yup.string().email("Неверный формат").required("Обязательное поле"),
  password: Yup.string().required("Обязательное поле"),
});

const Form = styled("form")(({ theme }) => ({
  width: theme.spacing(50),
  display: "grid",
  gridAutoFlow: "row",
  gap: theme.spacing(1),
  padding: theme.spacing(3),
}));

const Authorization = () => {
  const formik = useFormik({
    validationSchema: signInSchema,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <TextField
        name="email"
        type="email"
        label="Email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={!!formik.errors.email}
        helperText={formik.errors.email ?? " "}
      />
      <TextField
        name="password"
        type="password"
        label="Пароль"
        value={formik.values.password}
        onChange={formik.handleChange}
        error={!!formik.errors.password}
        helperText={formik.errors.password ?? " "}
      />
      <Button variant="contained" type="submit">
        Войти
      </Button>
    </Form>
  );
};

export default Authorization;

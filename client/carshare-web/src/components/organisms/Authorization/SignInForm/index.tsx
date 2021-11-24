import { IconButtonProps, styled } from "@mui/material";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import Oidc from "oidc-client";
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
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));

      const config = {
        authority: "https://localhost:2010",
        client_id: "carshare-web",
        redirect_uri: "https://localhost:2000/signin-oidc",
        popup_post_logout_redirect_uri: "https://localhost:2000/logout-oidc",
        response_type: "code",
        scope: "openid profile",
      };

      const manager = new Oidc.UserManager(config);
      const user = await manager.getUser();

      if (user) {
        await userLoggedIn(user);
      } else {
        console.log("Redirecting in 3s...");

        setTimeout(async () => {
          try {
            const usr = await manager.signinPopup();
            await userLoggedIn(usr);
          } catch (error) {
            console.log(error);
          }
        }, 3000);
      }

      async function userLoggedIn(user: Oidc.User) {
        console.log(user);
        // call the API
        const response = await fetch("https://localhost:2003/WeatherForecast", {
          headers: {
            Authorization: "Bearer " + user.access_token,
          },
        });

        const data = await response.text();
        console.log(data);
      }
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
        // TODO: check is touched
        helperText={formik.errors.password ?? " "}
      />
      <Button variant="contained" type="submit">
        Войти
      </Button>
    </Form>
  );
};

export default Authorization;

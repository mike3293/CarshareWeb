import { IconButtonProps, styled } from "@mui/material";
import { Button, Dialog } from "@mui/material";
import { useState } from "react";
import Oidc from "oidc-client";
import LoginIcon from "@mui/icons-material/Login";

const Authorization = () => {
  const [isOpen, setIsOpen] = useState(false);

  const cle = async () => {
    // alert(JSON.stringify(values, null, 2));

    const config = {
      authority: "https://localhost:2010",
      client_id: "carshare-web",
      redirect_uri: "http://localhost:2000/signin-oidc",
      popup_post_logout_redirect_uri: "http://localhost:2000/logout-oidc",
      response_type: "code",
      scope: "openid profile",
    };

    const manager = new Oidc.UserManager(config);
    const user = await manager.getUser();

    if (user) {
      await userLoggedIn(user);
    } else {
      console.log("Redirecting...");

      try {
        const usr = await manager.signinPopup();
        await userLoggedIn(usr);
      } catch (error) {
        console.log(error);
      }
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
  };

  return (
    <Button
      sx={{ position: "absolute", zIndex: 3000, right: 10, top: 10 }}
      color="secondary"
      variant="contained"
      onClick={cle}
    >
      <LoginIcon />
    </Button>
  );
};

export default Authorization;

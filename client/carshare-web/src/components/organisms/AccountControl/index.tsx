import { Box, Typography } from "@mui/material";
import { Button, Dialog } from "@mui/material";
import { useEffect, useState } from "react";
import Oidc from "oidc-client";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

import { useUserStore } from "src/context/userStore";
import shallow from "zustand/shallow";

const config = {
  authority: "https://localhost:2010",
  client_id: "carshare-web",
  redirect_uri: "http://localhost:2000/signin-oidc",
  popup_post_logout_redirect_uri: "http://localhost:2000/logout-oidc",
  response_type: "code",
  scope: "openid profile",
};

const AccountControl = () => {
  const [email, setOidcUser, resetUser] = useUserStore(
    (s) => [s.email, s.setOidcUser, s.resetUser],
    shallow
  );

  useEffect(() => {
    const manager = new Oidc.UserManager(config);

    const initUser = async () => {
      if (!email) {
        const user = await manager.getUser();

        if (user) {
          setOidcUser(user);
        }
      }
    };

    initUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async () => {
    const manager = new Oidc.UserManager(config);

    const user = await manager.getUser();

    if (user) {
      setOidcUser(user);
    } else {
      try {
        const loggedInUser = await manager.signinPopup();
        setOidcUser(loggedInUser);
      } catch (error) {
        alert(error);
      }
    }
  };

  const signOut = async () => {
    const manager = new Oidc.UserManager(config);

    try {
      await manager.signoutPopup();
      resetUser();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box sx={{ position: "absolute", zIndex: 3000, right: 10, top: 10 }}>
      {email && (
        <Button color="primary" onClick={signOut}>
          {email} <LogoutIcon sx={{ ml: 1 }} />
        </Button>
      )}
      {!email && (
        <Button color="secondary" variant="contained" onClick={signIn}>
          <LoginIcon />
        </Button>
      )}
    </Box>
  );
};

export default AccountControl;

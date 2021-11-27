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

export const useInitAuthorization = () => {
  const [initFinished, setInitFinished] = useState(false);

  const [email, setOidcUser] = useUserStore(
    (s) => [s.email, s.setOidcUser],
    shallow
  );

  useEffect(() => {
    if (!email) {
      const manager = new Oidc.UserManager(config);

      const initUser = async () => {
        const user = await manager.getUser();

        if (user) {
          setOidcUser(user);
        }

        setInitFinished(true);
      };

      initUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return initFinished;
};

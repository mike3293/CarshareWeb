import type { NextPage } from "next";
import { useEffect } from "react";
import Oidc from "oidc-client";
import FullPageProgressBar from "src/components/atoms/FullPageProgressBar";

const LogOutOidc: NextPage = () => {
  useEffect(() => {
    const manager = new Oidc.UserManager({
      response_mode: "query",
    });

    manager
      .signoutPopupCallback()
      .then(function (user) {
        console.log(user);
      })
      .catch(function (e) {
        console.error(e);
      });
  }, []);

  return <FullPageProgressBar />;
};

export default LogOutOidc;

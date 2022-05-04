import type { NextPage } from "next";
import FullPageProgressBar from "src/components/atoms/FullPageProgressBar";
import { useEffect } from "react";
import Oidc from "oidc-client";

const SignInOidc: NextPage = () => {
  useEffect(() => {
    const manager = new Oidc.UserManager({
      response_mode: "query",
    });

    manager.signinPopupCallback();
  }, []);

  return <FullPageProgressBar />;
};

export default SignInOidc;

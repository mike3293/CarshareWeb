import type { NextPage } from "next";
import FullPageProgressBar from "src/components/atoms/FullPageProgressBar";
import { useEffect } from "react";
import Oidc from "oidc-client";

const SignInOidcSilent: NextPage = () => {
  useEffect(() => {
    const manager = new Oidc.UserManager({
      response_mode: "query",
    });

    manager.signinSilentCallback();
  }, []);

  return <FullPageProgressBar />;
};

export default SignInOidcSilent;

import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import Authorization from "src/components/organisms/Authorization";
import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import Oidc from "oidc-client";

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

  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
};

export default LogOutOidc;

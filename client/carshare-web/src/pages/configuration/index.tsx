import type { GetServerSideProps, NextPage } from "next";
import FullPageProgressBar from "src/components/atoms/FullPageProgressBar";
import { useEffect } from "react";
import Oidc from "oidc-client";
import { useUserStore } from "src/context/userStore";
import { Role } from "src/types/Role";
import { Policy, usePolicy } from "src/hooks/usePolicy";
import { useRouter } from "next/dist/client/router";

const Configuration: NextPage = () => {
  const router = useRouter();

  const role = useUserStore((s) => s.role);
  const haveAccessToConfiguration = usePolicy(Policy.CanManageConfiguration, {
    role,
  });

  useEffect(() => {
    if (!haveAccessToConfiguration) {
      router.replace("/");
    }
  }, [haveAccessToConfiguration, router]);

  return <FullPageProgressBar />;
};

// TODO: try to add serverside auth
export default Configuration;

import type { NextPage } from "next";
import AccountControl from "src/components/organisms/AccountControl";
import dynamic from "next/dynamic";
import { useInitAuthorization } from "src/hooks/useInitAuthorization";

const MapComponent = dynamic(
  () => {
    return import("src/components/organisms/Map");
  },
  { ssr: false }
);

const Home: NextPage = () => {
  useInitAuthorization();

  return (
    <>
      <AccountControl />
      <MapComponent />
    </>
  );
};

export default Home;

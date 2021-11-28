import type { NextPage } from "next";
import Map from "src/components/organisms/Map";
import AccountControl from "src/components/organisms/AccountControl";

const Home: NextPage = () => {
  return (
    <>
      <AccountControl />
      <Map />
    </>
  );
};

export default Home;

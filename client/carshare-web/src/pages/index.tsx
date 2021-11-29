import type { NextPage } from "next";
import Map from "src/components/organisms/Map";
import AccountControl from "src/components/organisms/AccountControl";
import dynamic from "next/dynamic";

const Home: NextPage = () => {
  return (
    <>
      <AccountControl />
      <Map />
    </>
  );
};

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});

import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import services from "src/config/services";

const MapComponent = dynamic(
  () => {
    return import("src/components/organisms/Map");
  },
  { ssr: false }
);

const Home: NextPage = () => {
  return <MapComponent />;
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const queryClient = new QueryClient();

  try {
    if (process.env.NODE_ENV === "production") {
      // queryClient.prefetchQuery("getPublicCars", () =>
      //   services.publicCars.getCars()
      // );
      // queryClient.prefetchQuery("getProvidersSummary", () =>
      //   services.publicCars.getProvidersSummary()
      // );
    }

    return { props: { dehydratedState: dehydrate(queryClient) } };
  } catch (e) {
    const status = (e as Response)?.status || 500;

    if (status === 404) {
      return {
        notFound: true,
      };
    }

    ctx.res.statusCode = status;

    throw new Error("Unable to fetch cars");
  }
};

export default Home;

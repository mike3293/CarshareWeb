import type { GetServerSideProps, NextPage } from "next";
import dynamic from "next/dynamic";
import { QueryCache } from "react-query";
import { dehydrate } from "react-query/hydration";

const MapComponent = dynamic(
  () => {
    return import("src/components/organisms/Map");
  },
  { ssr: false }
);

const Home: NextPage = () => {
  return <MapComponent />;
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const queryCache = new QueryCache();

//   try {
//     const listing = await getListingInfo(id);

//     queryCache.setQueryData(["getActiveListing", listing.aliasId], listing);

//     return {
//       props: {
//         listingAliasId: id,
//         RQState: dehydrate(queryCache),
//         isLetting:
//           listing.propertyDetails.propertySaleType === SaleType.Letting,
//       },
//     };
//   } catch (e) {
//     const status = e?.response?.status || 500;

//     if (status === 404) {
//       return {
//         notFound: true,
//       };
//     }

//     ctx.res.statusCode = status;

//     throw new Error("Unable to fetch sneak peek details");
//   }
// };

export default Home;

import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

const Scroll = dynamic(
  () => {
    return import("src/components/organisms/Map");
  },
  { ssr: false }
);

const Home: NextPage = () => {
  return <Scroll />;
};

export default Home;

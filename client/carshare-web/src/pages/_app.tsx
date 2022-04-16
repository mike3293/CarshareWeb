import "./globalStyles.scss";

import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import theme from "src/config/theme/theme";
import dynamic from "next/dynamic";
import { useInitAuthorization } from "src/hooks/useInitAuthorization";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  useInitAuthorization();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1"
        />
        <title>Carshare Web</title>
      </Head>
      <ToastContainer />
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});

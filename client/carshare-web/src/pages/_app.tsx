import "./globalStyles.scss";

import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import theme from "src/config/theme/theme";
import { useInitAuthorization } from "src/hooks/useInitAuthorization";
import FullPageProgressBar from "src/components/atoms/FullPageProgressBar";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  const initFinished = useInitAuthorization();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,maximum-scale=1"
        />
        <title>Carshare Web</title>
      </Head>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          {initFinished ? (
            <Component {...pageProps} />
          ) : (
            <FullPageProgressBar />
          )}
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;

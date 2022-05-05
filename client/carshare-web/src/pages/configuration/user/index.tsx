import type { NextPage } from "next";
import Link from "next/link";
import { useEffect } from "react";
import { useUserStore } from "src/context/userStore";
import { Policy, usePolicy } from "src/hooks/usePolicy";
import ProviderTarrifsForm from "src/components/organisms/ProviderTarrifsForm";
import { useRouter } from "next/dist/client/router";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  styled,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useQuery } from "react-query";
import services from "src/config/services";
import { grey } from "@mui/material/colors";
import { useInitAuthorization } from "src/hooks/useInitAuthorization";

const Container = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 4),
}));

const ProviderImage = styled("img")(({ theme }) => ({
  height: theme.spacing(4),
}));

const ProviderTitle = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "32px 1fr",
  gap: theme.spacing(2),
  alignItems: "center",
}));

const GlobalConfiguration: NextPage = () => {
  const router = useRouter();

  const authInProgress = useInitAuthorization();

  const userId = useUserStore((s) => s.id);

  useEffect(() => {
    if (!authInProgress && !userId) {
      router.replace("/");
    }
  }, [authInProgress, userId, router]);

  const { data = [] } = useQuery(
    "getTariffs",
    () => services.configuration.getTariffs(),
    {
      refetchOnWindowFocus: true,
      enabled: !!userId,
    }
  );

  return (
    <Container>
      <Link href="/">
        <a>
          <Button>{"<"} Вернутся на карту</Button>
        </a>
      </Link>
      <Typography variant="h5">Конфигурация тарифов</Typography>
      {data.map((p) => (
        <Accordion key={p.id} sx={{ boxShadow: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ backgroundColor: grey[50] }}
          >
            <ProviderTitle>
              <ProviderImage src={p.provider.logoUrl} alt="logo" />
              <Typography>{p.provider.name}</Typography>
            </ProviderTitle>
          </AccordionSummary>
          <AccordionDetails>
            <ProviderTarrifsForm provider={p} disabled />
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default GlobalConfiguration;

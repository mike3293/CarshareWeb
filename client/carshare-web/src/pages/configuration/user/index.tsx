import type { NextPage } from "next";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useUserStore } from "src/context/userStore";
import ProviderUserTariffsForm from "src/components/organisms/ProviderUserTariffsForm";
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
import { groupBy } from "lodash";
import FullPageProgressBar from "src/components/atoms/FullPageProgressBar";

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

  const email = useUserStore((s) => s.email);

  useEffect(() => {
    if (!authInProgress && !email) {
      router.replace("/");
    }
  }, [authInProgress, email, router]);

  const { data: tariffs = [], isLoading: tariffsLoading } = useQuery(
    "getTariffs",
    () => services.configuration.getTariffs(),
    {
      refetchOnWindowFocus: false,
      enabled: !!email,
    }
  );

  const { data: override = { carPrices: [] }, isLoading: overridesLoading } =
    useQuery(
      "getTariffOverrides",
      () => services.configuration.getTariffOverrides(),
      {
        refetchOnWindowFocus: false,
        enabled: !!email,
      }
    );

  const gropedPriceOverrides = useMemo(
    () => groupBy(override.carPrices, (p) => p.providerId),
    [override]
  );

  if (authInProgress || tariffsLoading || overridesLoading) {
    return <FullPageProgressBar />;
  }

  return (
    <Container>
      <Link href="/">
        <a>
          <Button>{"<"} Вернутся на карту</Button>
        </a>
      </Link>
      <Typography variant="h5">Конфигурация тарифов для {email}</Typography>
      {tariffs.map((p) => (
        <Accordion key={p.id} sx={{ boxShadow: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ backgroundColor: grey[50] }}
          >
            <ProviderTitle>
              <ProviderImage src={p.logoUrl} alt="logo" />
              <Typography>{p.name}</Typography>
            </ProviderTitle>
          </AccordionSummary>
          <AccordionDetails>
            <ProviderUserTariffsForm
              provider={p}
              overrides={gropedPriceOverrides[p.id]}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};

export default GlobalConfiguration;

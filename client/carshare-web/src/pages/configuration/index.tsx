import type { NextPage } from "next";
import { useEffect } from "react";
import { useUserStore } from "src/context/userStore";
import { Policy, usePolicy } from "src/hooks/usePolicy";
import ProviderTarrifsForm from "src/components/organisms/ProviderTarrifsForm";
import { useRouter } from "next/dist/client/router";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useQuery } from "react-query";
import services from "src/config/services";

const ProviderImage = styled("img")(({ theme }) => ({
  height: theme.spacing(4),
}));

const ProviderTitle = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "32px 1fr",
  gap: theme.spacing(2),
  alignItems: "center",
}));

const Configuration: NextPage = () => {
  const router = useRouter();

  const role = useUserStore((s) => s.role);
  const haveAccessToConfiguration = usePolicy(Policy.CanManageConfiguration, {
    role,
  });

  useEffect(() => {
    if (!haveAccessToConfiguration) {
      router.replace("/");
    }
  }, [haveAccessToConfiguration, router]);

  const { data = [] } = useQuery(
    "getConfiguration",
    () => services.configuration.getTarrifs(),
    {
      refetchOnWindowFocus: true,
      enabled: haveAccessToConfiguration,
    }
  );

  return (
    <Box>
      {data.map((p) => (
        <Accordion key={p.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <ProviderTitle>
              <ProviderImage src={p.provider.logoUrl} alt="logo" />
              <Typography>{p.provider.name}</Typography>
            </ProviderTitle>
          </AccordionSummary>
          <AccordionDetails>
            <ProviderTarrifsForm provider={p} />
            <Typography>{JSON.stringify(p, null, 2)}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default Configuration;

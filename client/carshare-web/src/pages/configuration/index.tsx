import type { NextPage } from "next";
import { useEffect } from "react";
import { useUserStore } from "src/context/userStore";
import { Policy, usePolicy } from "src/hooks/usePolicy";
import { useRouter } from "next/dist/client/router";
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useQuery } from "react-query";
import services from "src/config/services";

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
      refetchInterval: 1000,
      enabled: haveAccessToConfiguration,
    }
  );

  return (
    <Box>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Accordion 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{JSON.stringify(data, null, 2)}</Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Accordion 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Configuration;

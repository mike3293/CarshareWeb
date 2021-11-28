import type { GetServerSideProps, NextPage } from "next";
import FullPageProgressBar from "src/components/atoms/FullPageProgressBar";
import { useEffect } from "react";
import Oidc from "oidc-client";
import { useUserStore } from "src/context/userStore";
import { Role } from "src/types/Role";
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
      refetchOnWindowFocus: false,
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

// TODO: try to add serverside auth
export default Configuration;

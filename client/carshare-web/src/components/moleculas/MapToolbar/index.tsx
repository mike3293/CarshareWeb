import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

interface IMapToolbarProps {
  isMobile: boolean;
  position: "top" | "bottom";
}

const MapToolbar = ({
  isMobile,
  position,
  children,
}: PropsWithChildren<IMapToolbarProps>) => (
  <Box
    sx={{
      position: "absolute",
      zIndex: 1000,
      display: "grid",
      gridAutoFlow: "row",
      gap: 1,
      right: isMobile ? 8 : 11,
      top: position === "top" ? (isMobile ? 50 : 90) : undefined,
      bottom: position === "bottom" ? (isMobile ? 55 : 100) : undefined,
    }}
  >
    {children}
  </Box>
);

export default MapToolbar;

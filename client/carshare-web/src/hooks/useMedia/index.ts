import { Options, Theme, useMediaQuery } from "@mui/material";

export const useSmallMobile = (options?: Options) =>
  useMediaQuery<Theme>((theme) => theme.breakpoints.down("xs"), options);

export const useMobile = (options?: Options) =>
  useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"), options);

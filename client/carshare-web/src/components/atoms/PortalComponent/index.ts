import { IconButtonProps, styled } from "@mui/material";
import { IconButton } from "@mui/material";
import { PropsWithChildren, ReactNode } from "react";
import ReactDOM from "react-dom";

const PortalComponent = (props: PropsWithChildren<{}>) => {
  const modalRoot = document.getElementById("__next");

  if (modalRoot) {
    return ReactDOM.createPortal(props.children, modalRoot);
  }

  return null;
};

export default PortalComponent;

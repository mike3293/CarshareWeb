import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { ReactNode, useState } from "react";

const drawerBleeding = 40;

interface Props {
  children: ReactNode;
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
}));

const ScrollFixer = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: drawerBleeding,
  touchAction: "none",
  pointerEvents: "none",
  zIndex: 1198,
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

const DrawerWithEdge = (props: Props) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />
      <ScrollFixer
        onTouchMove={(e) => e.stopPropagation()}
        onTouchMoveCapture={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchStartCapture={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
        onTouchEndCapture={(e) => e.stopPropagation()}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        // PaperProps={{
        //   sx: {
        //     pointerEvents: "none",
        //   },
        // }}
        disableSwipeToOpen={false}
        hideBackdrop
        disableScrollLock
        ModalProps={{
          keepMounted: true,
        }}
        // onTouchMove={(e) => e.stopPropagation()}
        // onTouchStart={(e) => e.stopPropagation()}
        // onTouchEnd={(e) => e.stopPropagation()}
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
            // touchAction: "none",
          }}
          // onTouchMove={(e) => e.stopPropagation()}
          // onTouchMoveCapture={(e) => e.stopPropagation()}
          // onTouchStart={(e) => e.stopPropagation()}
          // onTouchStartCapture={(e) => e.stopPropagation()}
          // onTouchEnd={(e) => e.stopPropagation()}
          // onTouchEndCapture={(e) => e.stopPropagation()}
        >
          <Puller />
          <Typography sx={{ p: 2, color: "text.secondary" }}>
            51 results
          </Typography>
        </StyledBox>
        <StyledBox
          sx={{
            px: 2,
            pb: 2,
            height: "100%",
            overflow: "auto",
          }}
        >
          <Skeleton variant="rectangular" height="100%" />
        </StyledBox>
      </SwipeableDrawer>
    </>
  );
};

export default DrawerWithEdge;

import { IconButtonProps, styled } from "@mui/material";
import { IconButton } from "@mui/material";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  zIndex: 1000,
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
}));

const MapButton = (props: IconButtonProps) => {
  return <StyledIconButton {...props} />;
};

export default MapButton;

import MapButton from "src/components/atoms/MapButton";
import RefreshIcon from "@mui/icons-material/Refresh";

interface IRefreshCarsProps {
  isMobile: boolean;
  refresh: () => void;
}

const RefreshCars = ({ isMobile, refresh }: IRefreshCarsProps) => {
  return (
    <MapButton
      onClick={refresh}
      color="primary"
      sx={{
        right: isMobile ? 8 : 11,
        bottom: isMobile ? 135 : 180,
      }}
    >
      <RefreshIcon />
    </MapButton>
  );
};

export default RefreshCars;

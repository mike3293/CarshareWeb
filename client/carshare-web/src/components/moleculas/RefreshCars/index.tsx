import MapButton from "src/components/atoms/MapButton";
import RefreshIcon from "@mui/icons-material/Refresh";

interface IRefreshCarsProps {
  refresh: () => void;
}

const RefreshCars = ({ refresh }: IRefreshCarsProps) => {
  return (
    <MapButton onClick={refresh} color="primary">
      <RefreshIcon />
    </MapButton>
  );
};

export default RefreshCars;

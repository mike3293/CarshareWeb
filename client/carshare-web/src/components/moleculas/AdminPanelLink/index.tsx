import SettingsIcon from "@mui/icons-material/Settings";
import MapButton from "src/components/atoms/MapButton";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useRouter } from "next/dist/client/router";

interface IAdminPanelLinkProps {
  isMobile: boolean;
}

const AdminPanelLink = ({ isMobile }: IAdminPanelLinkProps) => {
  const router = useRouter();

  return (
    <MapButton
      onClick={() => router.push("/configuration")}
      color="secondary"
      sx={{
        right: isMobile ? 8 : 11,
        top: isMobile ? 50 : 100,
      }}
    >
      <SettingsIcon />
    </MapButton>
  );
};

export default AdminPanelLink;

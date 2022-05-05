import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import MapButton from "src/components/atoms/MapButton";
import { useRouter } from "next/dist/client/router";

const AdminPanelLink = () => {
  const router = useRouter();

  return (
    <MapButton
      onClick={() => router.push("/configuration/global")}
      color="secondary"
    >
      <SettingsApplicationsIcon />
    </MapButton>
  );
};

export default AdminPanelLink;

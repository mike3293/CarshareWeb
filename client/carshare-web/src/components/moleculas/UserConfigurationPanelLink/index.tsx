import SettingsIcon from "@mui/icons-material/Settings";
import MapButton from "src/components/atoms/MapButton";
import { useRouter } from "next/dist/client/router";

const UserConfigurationPanelLink = () => {
  const router = useRouter();

  return (
    <MapButton
      onClick={() => router.push("/configuration/user")}
      color="secondary"
    >
      <SettingsIcon />
    </MapButton>
  );
};

export default UserConfigurationPanelLink;

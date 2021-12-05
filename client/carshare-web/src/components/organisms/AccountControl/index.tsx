import { Box } from "@mui/material";
import { Button } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { authManager } from "src/utils/authManager";
import { useUserStore } from "src/context/userStore";
import shallow from "zustand/shallow";

const AccountControl = () => {
  const [email, setOidcUser, resetUser] = useUserStore(
    (s) => [s.email, s.setOidcUser, s.resetUser],
    shallow
  );

  const signIn = async () => {
    const user = await authManager.getUser();

    if (user) {
      setOidcUser(user);
    } else {
      try {
        const loggedInUser = await authManager.signinPopup();
        setOidcUser(loggedInUser);
      } catch (error) {
        alert(error);
      }
    }
  };

  const signOut = async () => {
    try {
      await authManager.signoutPopup();
      resetUser();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <Box sx={{ position: "absolute", zIndex: 900, right: 10, top: 10 }}>
      {email && (
        <Button color="primary" onClick={signOut}>
          {email} <LogoutIcon sx={{ ml: 1 }} />
        </Button>
      )}
      {!email && (
        <Button color="secondary" variant="contained" onClick={signIn}>
          <LoginIcon />
        </Button>
      )}
    </Box>
  );
};

export default AccountControl;

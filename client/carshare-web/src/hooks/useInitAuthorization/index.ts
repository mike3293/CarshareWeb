import { useEffect, useState } from "react";
import { useUserStore } from "src/context/userStore";
import shallow from "zustand/shallow";
import { authManager } from "src/utils/authManager";

export const useInitAuthorization = () => {
  const [inProgress, setInProgress] = useState(true);
  const [email, setOidcUser] = useUserStore(
    (s) => [s.email, s.setOidcUser],
    shallow
  );

  useEffect(() => {
    const initUser = async () => {
      if (!email) {
        const user = await authManager.getUser();
        console.log("user retrived from getUser()", user);

        if (user) {
          setOidcUser(user);
        } else {
          try {
            const fetchedUser = await authManager.signinSilent();
            console.log("user retrived from signinSilent()", fetchedUser);

            if (fetchedUser) {
              setOidcUser(fetchedUser);
            }
          } catch {
            console.log("signinSilent() failed");
          }
        }
      }
      setInProgress(false);
    };

    console.log("initUser() called");
    initUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return inProgress;
};

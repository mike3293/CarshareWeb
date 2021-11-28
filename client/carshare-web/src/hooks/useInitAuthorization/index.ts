import { useEffect, useState } from "react";
import { useUserStore } from "src/context/userStore";
import shallow from "zustand/shallow";
import { authManager } from "src/utils/authManager";

export const useInitAuthorization = () => {
  const [initFinished, setInitFinished] = useState(false);

  const [email, setOidcUser] = useUserStore(
    (s) => [s.email, s.setOidcUser],
    shallow
  );

  useEffect(() => {
    const initUser = async () => {
      const user = await authManager.getUser();

      if (!email && user) {
        setOidcUser(user);
      }
      console.log("manager", authManager);

      setInitFinished(true);
    };

    initUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return initFinished;
};

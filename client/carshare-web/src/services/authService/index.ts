import { useUserStore } from "src/context/userStore";
const token = useUserStore.getState().accessToken;

alert(token);

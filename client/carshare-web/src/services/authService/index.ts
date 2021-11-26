import { useUserStore } from "src/context/userStore";
const token = useUserStore.getState().accessToken;

console.log(token);

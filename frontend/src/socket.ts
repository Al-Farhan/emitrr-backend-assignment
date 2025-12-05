import { io } from "socket.io-client";

console.log(import.meta.env.VITE_BACKEND_URL);
const URL =
  import.meta.env.NODE_ENV === "production"
    ? undefined
    : "http://localhost:3500";

export const socket = io(URL, {
  autoConnect: false,
});

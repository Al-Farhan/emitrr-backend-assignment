import { io } from "socket.io-client";

console.log(import.meta.env.VITE_BACKEND_URL);
const URL =
  import.meta.env.NODE_ENV === "production"
    ? undefined
    : import.meta.env.VITE_BACKEND_URL;

export const socket = io(URL, {
  autoConnect: false,
});

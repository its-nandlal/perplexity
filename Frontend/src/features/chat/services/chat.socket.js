import { io } from "socket.io-client";

export const initalizeSocketConnection = () => {
  const socket = io("http://localhost:8000", {
    withCredentials: true
  });

  socket.on("connect", () => {
    console.log("Socket connected"); // true
  });
};

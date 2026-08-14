import { io, Socket } from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";

const createSocket = (): Socket | null => {
  const token = Cookies.get("token");

  if (!token) {
    console.log("No token, socket will not connect");
    return null;
  }

  return io(process.env.SOCKET, {
    auth: {
      token,
    },
  });
};

const refreshAccessToken = async () => {
  const res = await axios.post(
    "/api/backend/auth/refresh-token",
    {},
    {
      withCredentials: true,
    },
  );

  const newAccessToken = res.data?.data?.token;

  if (!newAccessToken) {
    throw new Error("Failed to refresh access token");
  }

  Cookies.set("token", newAccessToken, {
    path: "/",
  });

  return newAccessToken;
};

export { createSocket, refreshAccessToken };

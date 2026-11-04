import { io, type Socket } from "socket.io-client";
import api from "@/lib/api";

export async function createSocket(): Promise<Socket | null> {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (!socketUrl) {
    console.warn("NEXT_PUBLIC_SOCKET_URL is not configured; real-time notifications are disabled.");
    return null;
  }

  const response = await api.post("auth/socket-ticket", {});
  const ticket = response.data?.data?.ticket;
  if (typeof ticket !== "string" || !ticket) {
    throw new Error("The API did not return a socket ticket");
  }

  return io(socketUrl, {
    autoConnect: false,
    reconnection: false,
    transports: ["websocket", "polling"],
    auth: { ticket },
  });
}

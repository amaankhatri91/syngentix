import { useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import appConfig from "@/configs/app.config";
import { useAppSelector } from "@/store";

type SocketEventHandler<T = any> = (data: T) => void;

// 🔒 module-level singleton
let socketInstance: Socket | null = null;

export const useSocketConnection = () => {
  const { token } = useAppSelector((state) => state.auth);
  const socketRef = useRef<Socket | null>(null);

  if (!socketRef.current) {
    if (!socketInstance) {
      socketInstance = io(appConfig.socketBaseUrl, {
        auth: { token },
        transports: ["websocket"],
        autoConnect: true,
      });
    }
    socketRef.current = socketInstance;
  }

  const emit = useCallback(<T>(event: string, payload: T) => {
    socketRef.current?.emit(event, payload);
  }, []);

  const on = useCallback(<T>(event: string, handler: SocketEventHandler<T>) => {
    const socket = socketRef.current;
    socket?.on(event, handler);

    return () => {
      socket?.off(event, handler);
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("✅ Socket connected:", socket?.id);
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
    };

    socket?.on("connect", handleConnect);
    socket?.on("disconnect", handleDisconnect);

    return () => {
      socket?.off("connect", handleConnect);
      socket?.off("disconnect", handleDisconnect);
    };
  }, []);

  return {
    socket: socketRef.current,
    emit,
    on,
  };
};

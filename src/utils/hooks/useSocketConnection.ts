import { useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import appConfig from "@/configs/app.config";
import { useAppSelector } from "@/store";

type SocketEventHandler<T = any> = (data: T) => void;

export const useSocketConnection = () => {
  const { token } = useAppSelector((state) => state.auth);

  let socket: Socket | null = null;

  const getSocket = () => {
    if (!socket) {
      socket = io(appConfig.socketBaseUrl, {
        auth: {
          token: token,
        },
      });
    }
    return socket;
  };

  const socketRef = useRef(getSocket());

  /** Emit any event */
  const emit = useCallback(<T>(event: string, payload: T) => {
    socketRef.current.emit(event, payload);
  }, []);

  /** Listen to any event */
  const on = useCallback(<T>(event: string, handler: SocketEventHandler<T>) => {
    const socket = socketRef.current;
    socket.on(event, handler);

    return () => {
      socket.off(event, handler);
    };
  }, []);

  /** Initialize socket connection lifecycle */
  useEffect(() => {
    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return {
    socket: socketRef.current,
    emit,
    on,
  };
};

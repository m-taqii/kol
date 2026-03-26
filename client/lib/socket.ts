import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
            withCredentials: true,
            autoConnect: false,
            transports: ["websocket", "polling"],
        });
    }
    return socket;
}

export function connectSocket(token?: string): Socket {
    const s = getSocket();

    // Pass token for auth only if provided explicitly, otherwise rely on httpOnly cookies
    if (token) {
        s.auth = { token };
    } else {
        s.auth = {};
    }

    if (!s.connected) {
        s.connect();
    }

    return s;
}

export function disconnectSocket() {
    if (socket?.connected) {
        socket.disconnect();
    }
}
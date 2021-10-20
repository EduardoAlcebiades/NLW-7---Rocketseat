import "dotenv/config";

import http from "http";

import { Server } from "socket.io";
import { app } from "./app";

const port = process.env.APP_PORT || 4000;

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

server.listen(port, () => {
  console.log(`Server started successful in port ${port}`);
});

export { io };

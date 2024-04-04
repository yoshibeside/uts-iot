import { WebSocketServer } from 'ws';
import express from "express";
import cors from "cors";
import http from "http";

import AuthRoutes from './routes/authroutes.js';
import PinRoutes from './routes/pinroutes.js';
import TransaksiRoutes from './routes/transaksiroutes.js';

const wss = new WebSocketServer({ port: 8080 });

const app = express();
const port = process.env.PORT || 5000;
// Create HTTP server
const server = http.createServer(app);

app.use(cors({origin: true, credentials: true}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(AuthRoutes);
app.use(PinRoutes);
app.use(TransaksiRoutes);

// Start HTTP server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

wss.on('connection', function connection(ws) {
  console.log('A new client connected');

  ws.on('message', function incoming(message) {
    console.log('Received: %s', message);
  });

  ws.send('Hello, client! Welcome to the WebSocket server.');
});
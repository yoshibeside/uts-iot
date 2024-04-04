import { WebSocketServer, WebSocket } from 'ws';
import express from "express";
import cors from "cors";
import http from "http";
import mqtt from "mqtt";

import AuthRoutes from './routes/authroutes.js';
import PinRoutes from './routes/pinroutes.js';
import TransaksiRoutes from './routes/transaksiroutes.js';

const wss = new WebSocketServer({ port: 8080 });

const options = {
  host: process.env.MQTT_HOST,
  port: process.env.MQTT_PORT,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
};

const client = mqtt.connect(options);

const app = express();
const port = process.env.PORT || 5000;
// Create HTTP server
const server = http.createServer(app);

app.use(cors({origin: true, credentials: true}));
app.use(express.json());

app.use(AuthRoutes);
app.use(PinRoutes);
app.use(TransaksiRoutes);

// Start HTTP server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

var wb_clients = [];

// Websocket
wss.on('connection', function connection(ws) {
  console.log('A new client connected');
  wb_clients.push(ws);

  ws.on('close', function () {
    console.log('Client disconnected');
    wb_clients = wb_clients.filter(function (otherWs) {
      return otherWs !== ws;
    });
  });

  ws.on('message', function(message) {
    console.log("Received ini balik: " + message)
    if (message === "berhasil") {
      client.publish('transaksi/status', message)
    } else if (message === "gagal") {
      client.publish('transaks/status', message)
    }
  })
});

// Function to send a message to all connected clients
function sendToClients(message) {
  wb_clients.forEach(function (client) {
    // Check if the connection is open before sending
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// MQTT
// Handle connection
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Subscribe to a topic
  client.subscribe('transaksi/saldo', (err) => {
    if (!err) {
      console.log('Subscribed to topic');
    }
  });
});

// Handle incoming messages
client.on('message', (topic, message) => {
  console.log('Received message:', topic, message.toString());
  sendToClients(message.toString());
});
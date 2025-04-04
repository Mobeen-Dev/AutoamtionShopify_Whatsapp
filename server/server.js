import QRCode from "qrcode";
import express from "express";
import cors from "cors";
import getQrCode, { sendMessageToNumber } from "./whatsappClient.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// In-memory storage for webhook queue and processed history
let webhookQueue = [];
let ordersQueue = [];
let history = [];


// Routes For CheckUp
app.get("/", (req, res) => {
  const currentTime = new Date();
  res.json({ Time: `${currentTime.toString()}` });
});

// Routes For Frontend
app.get("/whatsapp-qr", getQrCode);
app.get("/whatsapp-msg", sendMessageToNumber);
app.get("/progress", (req, res) => {
  res.json({
    delivered: history.length,
    delivery_history: history,
    pending: webhookQueue.length,
    pending_history: webhookQueue,
  });
});

// Routes For Webhook
app.post("/webhook", (req, res) => {
  const payload = req.body;
  webhookQueue.push(payload);
  console.log("Webhook received and queued:", payload);
  res.status(200).json({ message: "Webhook received and queued." });
});


/**
 * Background Process:
 * Periodically process the webhook queue every 5 seconds.
 * For each payload, simulate processing (e.g., sending a WhatsApp message),
 * log the result in history, and remove the entry from the queue.
 */
// const processQueue = () => {
//   if (webhookQueue.length > 0) {
//     const payload = webhookQueue.shift();
//     const ack = {
//       payload,
//       timestamp: Date.now(),
//       status: "delivered",
//     };
//     history.push(ack);
//     console.log("Processed payload:", payload);
//   }
// };

// setInterval(processQueue, 5000);

// Start the server on the desired port (default: 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

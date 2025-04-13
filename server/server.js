import QRCode from "qrcode";
import express from "express";
import cors from "cors";
// import getQrCode, { sendMessageToNumber } from "./remoteAuthTest.js";
import {RequestQueue, RequestGroup} from "./DataStucture.js";
import {countryPhoneCodes} from "./CountriesCode.js";

// deterministicMapping.js
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// Use a 32-byte key (256-bit). Replace with your secure key or load from env.
const SECRET_KEY = process.env.ENCRYPTION_KEY;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// In-memory storage for webhook queue and processed history
// let webhookQueue = [];
const webhookQueue = new RequestQueue();
let ordersQueue = [];
let history = [];

// Routes For CheckUp
app.get("/", (req, res) => {
  const currentTime = new Date();
  res.json({ Time: `${currentTime.toString()}` });
});

// Routes For Frontend
// app.get("/whatsapp-qr", getQrCode);
// app.get("/whatsapp-msg", sendMessageToNumber);
app.get("/progress", (req, res) => {
  res.json({
    delivered: history.length,
    delivery_history: history,
    pending: webhookQueue.length,
    pending_history: webhookQueue,
  });
});

// Helper function to handle responses form webhook
function parseWebhook(payload = {}) {
  // Safely retrieve top-level fields
  const orderNumber = payload.order_number || "404";
  const orderStatusUrl =
    payload.order_status_url ||
    "https://www.shopify.com/";
  let orderDate = payload.created_at || "";
  if (orderDate) {
    // Replace T with  ->  and remove anything after +
    orderDate = orderDate.replace("T", " -> ");
    orderDate = orderDate.slice(0, orderDate.length - 6);
  }

  // Retrieve customer fields
  const customer = payload.customer || {};
  const defaultAddress = customer.default_address || {};

  // Determine the customer name
  let customerName = defaultAddress.name || "";
  if (!customerName) {
    const firstName = customer.first_name || "";
    const lastName = customer.last_name || "";
    if(firstName!="" && lastName!="") {
    customerName = (firstName + " " + lastName).trim();
    }
  }

  // Determine the customer phone
  let customerPhone = (defaultAddress.phone || "404").trim();
  const countryCodekey = (defaultAddress.country_code || "PK");
  const countryCode = countryPhoneCodes[countryCodekey] || "404";
  
  if (customerPhone == "404") {
    const billingAddress = payload.billing_address || {};
    customerPhone = billingAddress.phone || "404";
  }
  customerPhone = customerPhone.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  if (customerPhone.startsWith(countryCode)) {
    console.log("Phone number already has the country code:", customerPhone);
  } else {
    // Remove the left-most digit if it is a "0".
    if (customerPhone.startsWith("0")) {
      customerPhone = customerPhone.substring(1); // removes the first character.
    }
    // Prepend the international country code.
    customerPhone = countryCode + customerPhone;
    console.log("Updated phone number with country code:", customerPhone);
  }
  

  // Extract items
  const lineItems = payload.line_items || [];
  const items = lineItems.map((item) => ({
    name: item.name || "",
    quantity: item.quantity || 0,
    price: item.price || "",
  }));

  // Extract summary information
  const subtotal = payload.subtotal_price || "";
  const tax = payload.total_tax || "";
  const total = payload.total_price || "";

  // Extract shipping information
  const shippingLines = payload.shipping_lines || [];
  let shippingFee = null;
  let shippingMethod = null;
  if (shippingLines.length > 0) {
    shippingFee = shippingLines[0].price || null;
    shippingMethod = shippingLines[0].title || null;
  }

  const shippingAddress = payload.shipping_address || {};
  const address = [
    shippingAddress.address1 || "",
    shippingAddress.address2 || "",
    shippingAddress.city || "",
    shippingAddress.country || "",
  ].join(", ");

  // Construct the result object
  return {
    orderNumber,
    orderStatusUrl,
    orderDate,
    customerName,
    customerPhone,
    items,
    subtotal,
    tax,
    shippingFee,
    total,
    address,
    shippingMethod,
  };
}

// function oldparseWebhook(payload = {}) {
//   // Destructure the main fields
//   const {
//     order_number: orderNumber = "404",
//     order_status_url:
//       orderStatusUrl = "https://shopify.dev/docs/api/admin-graphql/latest/objects/order",
//     created_at: rawOrderDate = "",
//     customer: {
//       default_address: {
//         name: defaultName = "Sample Name",
//         phone: defaultPhone = "923111786786",
//       } = {},
//       first_name: firstName = "Sample",
//       last_name: lastName = "Name",
//     } = {},
//     billing_address: { phone: billingPhone = "923111786786" } = {},
//     line_items: lineItems = [],
//     subtotal_price: subtotal = "0",
//     total_tax: tax = "0",
//     total_price: total = "0",
//     shipping_lines: shippingLines = [],
//   } = payload;

//   const shipping_address = payload.shipping_address || {};
//   const {
//     address1 = "Sample Address",
//     address2 = "",
//     city = "Sample City",
//     country = "Sample Country",
//   } = shipping_address;

//   // Fix up the order date
//   let orderDate = rawOrderDate
//     ? rawOrderDate.replace("T", " -> ").slice(0, -6)
//     : "";

//   // Determine the customer name
//   let customerName = defaultName || (firstName + " " + lastName).trim();

//   // Determine the customer phone
//   let customerPhone = defaultPhone.trim() || billingPhone;
//   // Remove non-numeric characters
//   customerPhone = customerPhone.replace(/[^0-9]/g, "");

//   // Map line items
//   const items = lineItems.map(({ name = "", quantity = 0, price = "" }) => ({
//     name,
//     quantity,
//     price,
//   }));

//   // Shipping information
//   let shippingFee = null;
//   let shippingMethod = null;
//   if (shippingLines.length > 0) {
//     shippingFee = shippingLines[0].price || null;
//     shippingMethod = shippingLines[0].title || null;
//   }

//   // Build the full shipping address
//   let address = "";
//   if (address1) {
//     address = [address1, address2, city, country].join(", ");
//   }

//   // Return the final object
//   return {
//     orderNumber,
//     orderStatusUrl,
//     orderDate,
//     customerName,
//     customerPhone,
//     items,
//     subtotal,
//     tax,
//     shippingFee,
//     total,
//     address,
//     shippingMethod,
//   };
//}

// Routes For Webhook

app.post("/webhook", (req, res) => {
  const payload = req.body;
  //console.log("Webhook received and queued:", payload);
  console.log("101 Parsed payload:", payload);
  // webhookQueue.push(parseWebhook(payload));
  res.status(200).json({ message: "Webhook received and queued." });
});

app.post("/receive", (req, res) => {
  res.status(200);
});

function deterministicDecrypt(ciphertextBase64) {
  // Convert base64 string back to buffer.
  const ciphertextBuffer = Buffer.from(ciphertextBase64, "base64");
  const decipher = crypto.createDecipheriv(
    "aes-256-ecb",
    Buffer.from(SECRET_KEY, "utf8"),
    null
  );
  decipher.setAutoPadding(true);
  const decryptedBuffer = Buffer.concat([
    decipher.update(ciphertextBuffer),
    decipher.final(),
  ]);
  return decryptedBuffer.toString("utf8");
}
// Define a POST endpoint with a dynamic requestId parameter
app.post("/request/:requestId", (req, res) => {
  const { requestId } = req.params;
  const senderId = deterministicDecrypt(requestId);
  const payload = req.body; // Extract the payload from the request body
  const body = parseWebhook(payload);


  webhookQueue.enqueueRequest(senderId, body.customerPhone, JSON.stringify(body));
  // console.log("102 Parsed payload:\n\n\n\n\n\n\n");
  // console.log("Enqueued payload:", webhookQueue.processNext());
  // console.log("102 Parsed payload:\n\n\n\n\n\n\n");
  // console.log("Webhook received and queued:", body);

  // Send a JSON response indicating the ID was received
  res.status(200).json({ message: `ID received`});
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

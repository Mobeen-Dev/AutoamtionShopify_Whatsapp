import dotenv from "dotenv";
dotenv.config();

import wwebjs from "whatsapp-web.js";
const { Client, RemoteAuth } = wwebjs;

import {
  initializeApp,
  getStorage,
  FirebaseStorageStore,
} from "wwebjs-firebase-storage";
import qrcode_terminal from "qrcode-terminal";

const app = initializeApp({
  apiKey: process.env.FIREBASE_apiKey,
  authDomain: process.env.FIREBASE_authDomain,
  projectId: process.env.FIREBASE_projectId,
  storageBucket: process.env.FIREBASE_storageBucket,
  messagingSenderId: process.env.FIREBASE_messagingSenderId,
  appId: process.env.FIREBASE_appId,
});

const client = new Client({
  clientId: "client-one",
  authStrategy: new RemoteAuth({
    store: new FirebaseStorageStore({
      firebaseStorage: getStorage(app),
      sessionPath: "sessions-whatsapp-web.js", // save in a sub-directory
    }),
    backupSyncIntervalMs: 60000, // 10 minutes
  }),
  // ... // other options
});

client.on("qr", (qr) => {
  qrcode_terminal.generate(qr, { small: true });
});

export async function sendMessageToNumber(
  number = "923414075054",
  message = "BetaTesting@DigilogSoftwares"
) {
  // Ensure the chat ID is in the format of number@c.us
  let chatId = number.includes("@") ? number : `${number}@c.us`;

  if (!client.info || !client.info.wid) {
    throw new Error("Client is not authenticated. Please scan the QR code.");
  }

  try {
    const response = await client.sendMessage(chatId, message);
    console.log(`Message sent to ${chatId}:`, response);
    return response;
  } catch (error) {
    console.error(`Failed to send message to ${chatId}:`, error);
    throw error;
  }
}


client.on("remote_session_saved", () => console.log("Remote session saved!"));
client.on("authenticated", () => console.log("Authenticated!"));
client.on("auth_failure", () => console.log("Authentication failed!"));
client.on("ready", () => {
  sendMessageToNumber("923214355751");
  // sendMessageToNumber();
  console.log("Client is ready!");
});
client.initialize();

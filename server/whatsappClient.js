// Import dependencies and load environment variables
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

// Define the class
class WhatsAppMessenger {
  /**
   * @param {string} senderNumber - A sender identifier if needed (not used directly by the client)
   * @param {string[]} recipients - Array of phone numbers (without the '@c.us' suffix)
   * @param {string} message - The message that will be sent to all recipients
   */
  constructor(senderNumber, recipients, message) {
    this.senderNumber = senderNumber; // Optional – could be used for logging
    this.recipients = recipients;
    this.message = message;

    // Initialize Firebase app with credentials from environment variables
    this.app = initializeApp({
      apiKey: process.env.FIREBASE_apiKey,
      authDomain: process.env.FIREBASE_authDomain,
      projectId: process.env.FIREBASE_projectId,
      storageBucket: process.env.FIREBASE_storageBucket,
      messagingSenderId: process.env.FIREBASE_messagingSenderId,
      appId: process.env.FIREBASE_appId,
    });

    // Create a new WhatsApp client instance with RemoteAuth via Firebase Storage
    this.client = new Client({
      clientId: "client-one",
      authStrategy: new RemoteAuth({
        store: new FirebaseStorageStore({
          firebaseStorage: getStorage(this.app),
          sessionPath: "sessions-whatsapp-web.js", // Saved in a sub-directory
        }),
        backupSyncIntervalMs: 60000, // e.g., backup session every 60 seconds
      }),
      // You may include other client options here if required
    });

    // Set up event listeners

    // Display QR code for authentication
    this.client.on("qr", (qr) => {
      qrcode_terminal.generate(qr, { small: true });
    });

    this.client.on("remote_session_saved", () =>
      console.log("Remote session saved!")
    );

    this.client.on("authenticated", () =>
      console.log("Authenticated successfully!")
    );
    
    this.client.on("auth_failure", () =>
      console.log("Authentication failed!")
    );

    // When client is ready, send the messages to all recipients
    this.client.on("ready", async () => {
      console.log("Client is ready!");
      await this.sendMessages();
    });
  }

  /**
   * Sends a message to a single number. The number is formatted as "number@c.us".
   * @param {string} number - The phone number to send the message to.
   * @param {string} message - The message to send.
   * @returns {Promise<any>}
   */
  async sendMessageToNumber(number, message) {
    // Format the phone number as needed (e.g., add '@c.us' if missing)
    let chatId = number.includes("@") ? number : `${number}@c.us`;

    // Check that the client has been authenticated
    if (!this.client.info || !this.client.info.wid) {
      throw new Error("Client is not authenticated. Please scan the QR code.");
    }

    try {
      const response = await this.client.sendMessage(chatId, message);
      console.log(`Message sent to ${chatId}:`, response);
      return response;
    } catch (error) {
      console.error(`Failed to send message to ${chatId}:`, error);
      throw error;
    }
  }

  /**
   * Iterates over the list of recipients and sends the message to each.
   */
  async sendMessages() {
    for (const contact of this.recipients) {
      await this.sendMessageToNumber(contact, this.message);
    }
    this.closeSession();
  }

  /**
   * Closes the client session.
   */
  closeSession() {
    console.log("Closing session.");
    this.client.destroy(); // Shuts down the client and cleans up resources
  }

  /**
   * Starts the initialization process for the client.
   */
  initialize() {
    this.client.initialize();
  }
}

export default WhatsAppMessenger;

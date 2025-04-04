// whatsapp/whatsappClient.js
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import QRCode from 'qrcode';

let currentQrCode = null;
let isAuthenticated = false;

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on('qr', async (qr) => {
  try {
    currentQrCode = await QRCode.toDataURL(qr);
    console.log('QR code generated');
  } catch (err) {
    console.error('Error generating QR code:', err);
  }
});

// Log when authenticated successfully
client.on('authenticated', (session) => {
    console.log('Authenticated successfully!');
    isAuthenticated = true;
  });

client.on('auth_failure', (msg) => {
console.error('Authentication failure:', msg);
isAuthenticated = false;
// Optionally, you can clear session data or force reinitialization here.
});


client.on('ready', () => {
  console.log('WhatsApp Client is ready!');
  isAuthenticated = true;
  currentQrCode = null; // Clear the QR code once authenticated
  sendMessageToNumber("923274292422"); // Call the function to send a message
  sendMessageToNumber("923274232422"); // Call the function to send a message
  sendMessageToNumber("923274292622"); // Call the function to send a message
  sendMessageToNumber("923273292422"); // Call the function to send a message
  sendMessageToNumber("923274292421"); // Call the function to send a message

});

client.initialize();

// Export an Express-compatible route handler
export default function getQrCode(req, res) {
  if (isAuthenticated) {
    res.json({ success: true, message: 'Authentication successful' });
  } else if (currentQrCode) {
    res.json({ success: false, qrCode: currentQrCode });
  } else {
    res.status(202).json({ message: 'QR code not generated yet' });
  }
}


/**
 * Sends a WhatsApp message to a given number.
 *
 * @param {string} number - The recipient's phone number (e.g., "1234567890").
 * @param {string} message - The text message to send.
 * @returns {Promise} - Resolves with the result of the sent message.
 */
export async function sendMessageToNumber(number="923274292422", message="BetaTesting@DigilogSoftwares") {
    // Ensure the chat ID is in the format of number@c.us
    let chatId = number.includes('@') ? number : `${number}@c.us`;
    
    if (!client.info || !client.info.wid) {
      throw new Error('Client is not authenticated. Please scan the QR code.');
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


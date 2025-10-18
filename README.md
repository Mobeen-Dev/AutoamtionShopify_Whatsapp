
# 💬 WhatsApp–Shopify Automation App

An intelligent automation system that connects **Shopify** with **WhatsApp** using real-time webhooks to send **order confirmations**, **status updates**, and **customer notifications**.  
Built with a **React frontend** and a **Node.js (Express)** backend, it enables seamless communication between stores and customers — reducing manual effort and improving engagement.

---

## 🚀 Features

- 🛒 **Shopify Webhook Integration** – Automatically fetch new order data from Shopify in real time.  
- 💬 **WhatsApp Automation** – Send personalized order confirmation and status messages directly to customers.  
- 🔐 **Secure Remote Authentication** – WhatsApp remote auth and session handling built for reliability.  
- 📦 **Order Status Sync** – Optionally update Shopify order statuses as messages are sent.  
- ⚙️ **Scalable Architecture** – React frontend + Node.js backend for flexibility and performance.  
- 🧰 **Utility Modules** – Includes structured code for encryption, data management, and message formatting.

---

## 🧩 Tech Stack

**Frontend:**  
- React (Vite)  
- TailwindCSS / CSS Modules

**Backend:**  
- Node.js + Express  
- Webhook Listener  
- WhatsApp Web.js / Baileys / Twilio API (depending on implementation)  
- Encryption & Remote Auth Modules  

**Integration:**  
- Shopify Webhooks for order creation and updates  

---

## 🗂️ Project Structure

```

project-root/
├── server/                 # Node.js backend
│   ├── server.js           # Main backend entry
│   ├── whatsappClient.js   # WhatsApp message handling
│   ├── remoteAuthTest.js   # Remote auth session management
│   ├── CountriesCode.js    # Country code utilities
│   ├── DataStructure.js    # Order data models
│   └── ...other modules
│
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/              # App pages
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
├── vite.config.js
└── README.md

````

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Mobeen-Dev/Shopify---Whatsapp.git
cd Shopify---Whatsapp
````

### 2️⃣ Install dependencies

```bash
# Install backend deps
cd server
npm install

# Install frontend deps
cd ../
npm install
```

### 3️⃣ Configure environment

Create a `.env` file in the server directory with:

```env
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_secret
WHATSAPP_SESSION=your_session_data
PORT=5000
```

### 4️⃣ Start the app

```bash
# Start backend
cd server
npm run start

# In another terminal: start frontend
npm run dev
```

The app will be running at:

* Frontend: **[http://localhost:5173](http://localhost:5173)**
* Backend: **[http://localhost:5000](http://localhost:5000)**

---

## 🔍 How It Works

1. **Shopify** sends an order event via webhook.
2. **Server.js** processes the event and extracts order details.
3. **WhatsApp Client** sends a confirmation message to the customer’s phone number.
4. The system optionally **updates order status** in Shopify for full synchronization.
5. The **React UI** allows configuration and monitoring of messages.

---

## 🧠 Future Enhancements

* 📊 Admin dashboard for monitoring message history and analytics.
* 🔁 Multi-store support with API keys.
* 📨 Support for order cancellation and refund notifications.
* 🔐 Enhanced OAuth integration with Shopify Partners API.

---

## 👨‍💻 Author

**Mobeen**
🚀 Developer passionate about automation, AI, and scalable backend systems.
📫 Connect on [GitHub](https://github.com/Mobeen-Dev)

---

## 🪪 License

This project is licensed under the **MIT License** – free to use and modify.

---

> 💡 *“Automate communication, simplify operations, and keep your customers connected — instantly.”*



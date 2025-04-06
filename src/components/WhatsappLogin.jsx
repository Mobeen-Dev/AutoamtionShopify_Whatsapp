import React, { useState, useEffect } from "react";


function Login() {
  const [qrData, setQrData] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchQr() {
    try {
      const response = await fetch("http://localhost:3000/whatsapp-qr");
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setAuthenticated(true);
        setQrData(null);
      } else {
        setQrData(data.qrCode);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching QR code:", error);
      setLoading(false);
    }
  }

  async function sendmsg() {
    try {
      const response = await fetch("http://localhost:3000/whatsapp-msg");
      const data = await response.json();
      console.log(data);
      
    //   if (data.success) {
    //     setAuthenticated(true);
    //     setQrData(null);
    //   } else {
    //     setQrData(data.qrCode);
    //   }
    //   setLoading(false);
    console.log("Message Sent Successfully",data);
    } catch (error) {
      console.error("Error fetching QR code:", error);
      setLoading(false);
    }
  }
  useEffect(() => {
    // Poll the backend every 2 seconds
    const interval = setInterval(fetchQr, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <h1>You have navigated to /Login</h1>
        <button onClick={fetchQr}>Fetch QR Code</button>
        <button onClick={sendmsg}>Send Message</button>
      </div>
      <div></div>
      <div>
        {loading ? (
          <p>Loading QR code...</p>
        ) : authenticated ? (
          <h2>Authentication Successful!</h2>
        ) : qrData ? (
          <img src={qrData} alt="WhatsApp QR Code" />
        ) : (
          <p>Waiting for QR code...</p>
        )}
      </div>
    </>
  );
}

export default Login;

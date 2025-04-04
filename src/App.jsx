
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/WhatsappLogin'
import Status from './components/Status'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

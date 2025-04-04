// components/Home.js
import React,{useState} from 'react';
import reactLogo from '../assets/react.svg'
import viteLogo from '../../public/vite.svg'
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    // Navigate to the /btnClicked route
    navigate('/login');
  };
  const handleStatusClick = () => {
    // Navigate to the /btnClicked route
    navigate('/status');
  };
  const handleClick = () => {
    // Navigate to the /btnClicked route
    navigate('/');
  };


  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <img src={viteLogo} className="logo" alt="Vite logo" />
      <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <div>
      <h1> - Whatsapp Automation -</h1>
      <div className="card">
      <button onClick={handleLoginClick}>Login Whatsapp Instance</button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      
      </div>      
      <div className="card">
      <button onClick={handleStatusClick}>Message Status</button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      
      </div>
      <button onClick={handleClick}>Message Status</button>
      <button onClick={handleClick}>Login Whatsapp Instance</button>
      <button onClick={handleClick}>Login Whatsapp Instance</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      

      
    </>
  )
}

export default Home;

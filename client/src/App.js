import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    // Fetch hello message from backend
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => {
        console.error('Error fetching data:', error);
        setMessage('Error connecting to backend');
      });

    // Fetch status from backend
    fetch('/api/status')
      .then(response => response.json())
      .then(data => setStatus(data))
      .catch(error => console.error('Error fetching status:', error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Hello World - React + Express</h1>
        <div className="content">
          <p className="message">{message}</p>
          {status && (
            <div className="status">
              <p>Server Status: {status.status}</p>
              <p>Timestamp: {status.timestamp}</p>
            </div>
          )}
        </div>
        <div className="info">
          <p>Frontend: React</p>
          <p>Backend: Node.js + Express</p>
        </div>
      </header>
    </div>
  );
}

export default App;

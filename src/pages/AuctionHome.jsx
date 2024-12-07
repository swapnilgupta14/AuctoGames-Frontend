import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8787'; // Replace with your backend URL
const WEBSOCKET_URL = 'ws://localhost:8787'; // Replace with your WebSocket URL

const AuctionRoom = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [auctionId, setAuctionId] = useState('');
  const [websocket, setWebsocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    if (auctionId) {
      const ws = new WebSocket(`${WEBSOCKET_URL}/ws/auction/${auctionId}`);
      setWebsocket(ws);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      };

      return () => ws.close();
    }
  }, [auctionId]);

  const registerUser = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, {
        username,
        email,
        password,
        role: 'USER',
      });
      console.log('User Registered:', response.data);
    } catch (error) {
      console.error('Registration Error:', error);
    }
  };

  const joinAuction = () => {
    if (websocket) {
      websocket.send(JSON.stringify({ type: 'join' }));
    }
  };

  const startAuction = () => {
    if (websocket) {
      websocket.send(JSON.stringify({ type: 'startAuction' }));
    }
  };

  const placeBid = () => {
    if (websocket) {
      websocket.send(JSON.stringify({ type: 'placeBid', userId: 1, bidAmount: parseInt(bidAmount) }));
    }
  };

  return (
    <div>
      <h1>Auction System</h1>

      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={registerUser}>Register</button>

      <h2>Auction</h2>
      <input
        type="text"
        placeholder="Auction ID"
        value={auctionId}
        onChange={(e) => setAuctionId(e.target.value)}
      />
      <button onClick={joinAuction}>Join Auction</button>
      <button onClick={startAuction}>Start Auction</button>

      <h2>Place Bid</h2>
      <input
        type="number"
        placeholder="Bid Amount"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
      />
      <button onClick={placeBid}>Place Bid</button>

      <h2>Messages</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
};

export default AuctionRoom;

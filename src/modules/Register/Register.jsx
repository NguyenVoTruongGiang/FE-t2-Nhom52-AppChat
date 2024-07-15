import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {WebSocketProvider, useWebSocket} from "../../hooks/useWebSocket";
import "./Register.css";

const Register = () => {
  const { registerUser, messages } = useWebSocket();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (messages && Array.isArray(messages)) {
      messages.forEach((message) => {
        if (message.event === "REGISTER") {
          if (message.status === "success") {
            alert("Registration successful! Please login.");
            navigate("/login");
          } else {
            alert("Username already exists. Please choose another.");
          }
        }
      });
    }
  }, [messages, navigate]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      registerUser(username, password);
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
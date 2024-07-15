import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWebSocket } from "../../hooks/useWebSocket";
import "./Login.css";

const Login = ({ onLogin }) => {
  const { loginUser, messages } = useWebSocket();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (messages && Array.isArray(messages)) {
      messages.forEach((message) => {
        if (message.event === "LOGIN") {
          if (message.status === "success") {
            onLogin(username);
            navigate(`/chat/${username}`);
          } else if (message.mes === "You are already logged in") {
            onLogin(username);
            navigate(`/chat/${username}`);
          } else {
            alert("Login failed. Please try again.");
          }
        } else if (message.event === "RE_LOGIN") {
          if (message.status === "success") {
            onLogin(username);
            navigate(`/chat/${username}`);
          } else {
            alert("Re-login failed. Please try again.");
          }
        }
      });
    }
  }, [messages, username, onLogin, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      loginUser(username, password);
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
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
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './modules/Login/Login';
import Register from './modules/Register/Register';
import ChatContainer from './component/ChatContainer';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (username) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <Router>
      <Routes>
      {/* <Route path="/" element={<Navigate to="/login" />} /> */}
        <Route path="/login" element={isLoggedIn ? <Navigate to={`/chat/${currentUser}`} /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat/:username" element={isLoggedIn ? <ChatContainer currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
// WebSocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const url = "ws://140.238.54.136:8080/chat/chat";

  useEffect(() => {
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log("WebSocket connected successfully.");
      setSocket(newSocket);
      setIsConnected(true);
    };

    newSocket.onmessage = (event) => {
      console.log("Received message from server:", event.data);
      try {
        const receivedMessage = JSON.parse(event.data);
        console.log("Parsed message:", receivedMessage);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      } catch (error) {
        console.error("Failed to parse message from the server:", error);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket connection closed.");
      setSocket(null);
      setIsConnected(false);
    };

    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [url]);

  const sendMessage = (message) => {
    if (isConnected && socket) {
      socket.send(message);
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  const registerUser = (username, password) => {
    sendMessage(
      JSON.stringify({
        action: "onchat",
        data: {
          event: "REGISTER",
          data: {
            user: username,
            pass: password,
          },
        },
      })
    );
  };

  const loginUser = (username, password) => {
    sendMessage(
      JSON.stringify({
        action: "onchat",
        data: {
          event: "LOGIN",
          data: {
            user: username,
            pass: password,
          },
        },
      })
    );
  };

  const reLogin = (user, code) => {
    sendMessage(
      JSON.stringify({
        action: "onchat",
        data: {
          event: "RE_LOGIN",
          data: {
            user: user,
            pass: code,
          },
        },
      })
    );
  };

  const sendChatMessage = (type, to, message) => {
    sendMessage(
      JSON.stringify({
        action: "onchat",
        data: {
          event: "SEND_CHAT",
          data: {
            type,
            to,
            mes: message,
          },
        },
      })
    );
  };

  const logout = () => {
    sendMessage(
      JSON.stringify({ action: "onchat", data: { event: "LOGOUT" } })
    );
  };

  const createRoom = (name) => {
    sendMessage(
      JSON.stringify({
        action: "onchat",
        data: {
          event: "CREATE_ROOM",
          data: { name },
        },
      })
    );
  };

  const joinRoom = (name) => {
    sendMessage(
      JSON.stringify({
        action: "onchat",
        data: {
          event: "JOIN_ROOM",
          data: { name },
        },
      })
    );
  };

  const getRoomChatMessages = (name, page) => {
    sendMessage(
      JSON.stringify({
        action: "onchat",
        data: {
          event: "GET_ROOM_CHAT_MES",
          data: { name, page },
        },
      })
    );
  };

  const getPeopleChatMessages = (name, page) => {
    sendMessage(
      JSON.stringify({
        action: "onchat",
        data: {
          event: "GET_PEOPLE_CHAT_MES",
          data: { name, page },
        },
      })
    );
  };

  const checkUser = (user) => {
    sendMessage(
      JSON.stringify({
        action: "onchat",
        data: {
          event: "CHECK_USER",
          data: { user },
        },
      })
    );
  };

  const getUserList = () => {
    sendMessage(
      JSON.stringify({
        action: "onchat",
        data: {
          event: "GET_USER_LIST",
        },
      })
    );
  };

  const value = {
    socket,
    isConnected,
    sendMessage,
    registerUser,
    loginUser,
    reLogin,
    sendChatMessage,
    logout,
    createRoom,
    joinRoom,
    getRoomChatMessages,
    getPeopleChatMessages,
    checkUser,
    getUserList,
    messages,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

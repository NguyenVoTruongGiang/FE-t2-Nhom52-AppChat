import { useEffect, useRef, useState } from "react";

const useWebSocket = (currentUser) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState(() => {
    const userKey = currentUser ? `users_${currentUser}` : 'default_user';
    const savedUsers = localStorage.getItem(userKey);
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  const socketRef = useRef(null);
  const url = "ws://140.238.54.136:8080/chat/chat";

  useEffect(() => {
    socketRef.current = new WebSocket(url);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected successfully.");
    };

    socketRef.current.onmessage = (event) => {
      console.log("Received message from server:", event.data);
      try {
        const receivedMessage = JSON.parse(event.data);
        console.log("Parsed message:", receivedMessage);
        setMessages(prevMessages => [...prevMessages, receivedMessage]);

        if (receivedMessage.event === "LOGIN" && receivedMessage.status === "success") {
          console.log("User logged in successfully.");
        }
      } catch (error) {
        console.error("Failed to parse message from the server:", error);
      }
    };
  
    socketRef.current.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      if (socketRef && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [url]);

  useEffect(() => {
    if(currentUser) {
      const userKey = `users_${currentUser}`;
      localStorage.setItem(userKey, JSON.stringify(users));
      console.log(currentUser);
    }
  }, [users, currentUser]);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    } else {
      console.error("WebSocket is not open.");
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
            pass: password
          }
        }
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
            pass: password
          }
        }
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
            mes: message
          }
        }
      })
    );
  };

  const addUser = (user) => {
    setUsers(prevUsers => [...prevUsers, user]);
  };

  return { messages, sendMessage, registerUser, loginUser, sendChatMessage, users, addUser };
};

export default useWebSocket;

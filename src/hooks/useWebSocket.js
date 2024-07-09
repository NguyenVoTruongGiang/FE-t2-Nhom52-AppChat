import { useEffect, useRef, useState } from "react";

const useWebSocket = (currentUser, dispatch) => {
  const [messages, setMessages] = useState([]);
  const [users] = useState(() => {
    const userKey = currentUser ? `users_${currentUser}` : "default_user";
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
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        if (receivedMessage.event === 'GET_USERS_SUCCESS') {
          dispatch({ type: 'GET_USERS_SUCCESS', payload: receivedMessage.data });
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
  }, [url, dispatch]);

  useEffect(() => {
    if (currentUser) {
      const userKey = `users_${currentUser}`;
      localStorage.setItem(userKey, JSON.stringify(users));
      console.log(currentUser);
    }
  }, [users, currentUser]);

  const sendMessage = (message) => {
    if (socketRef.current.readyState === WebSocket.OPEN) {
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

  // const logout = () => {
  //   sendMessage(
  //     JSON.stringify({ action: "onchat", data: { event: "LOGOUT" } })
  //   );
  // };

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

  return {
    messages,
    sendMessage,
    registerUser,
    loginUser,
    sendChatMessage,
    users,
    // logout,
    createRoom,
    joinRoom,
    getRoomChatMessages,
    getPeopleChatMessages,
    checkUser,
    getUserList,
  };
};

export default useWebSocket;

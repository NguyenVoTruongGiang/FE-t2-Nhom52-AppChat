import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "./Message";
import "../App.css";
import useWebSocket from "../hooks/useWebSocket";
import { setUserList } from "../redux/actions/userListSlice";

const ChatComponent = ({ currentUser, onLogout }) => {
  const dispatch = useDispatch();
  const { messages, sendChatMessage, addUser, getUserList } = useWebSocket(currentUser);
  const users = useSelector((state) => state.userList.users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatType, setChatType] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentUserMessages, setCurrentUserMessages] = useState([]);
  const [newUser, setNewUser] = useState("");

  useEffect(() => {
    messages.forEach((message) => {
      console.log("Received message:", message);
      switch (message.event) {
        case "GET_USER_LIST":
          if (message.status === "success") {
            dispatch(setUserList(message.data.users));
            getUserList();
            alert("GET_USER_LIST success.");
          } else {
            alert("GET_USER_LIST failed. Please try again.");
          }
          break;
        case "LOGOUT":
          if (message.status === "success") {
            onLogout();
          } else {
            alert("Logout failed. Please try again.");
          }
          break;
        default:
          break;
      }
    });
  }, [messages, dispatch, getUserList]);

  // Handle sending messages
  const handleSendMessage = () => {
    if (messageInput.trim() !== "" && selectedUser) {
      sendChatMessage({
        to: selectedUser,
        message: messageInput,
        type: chatType,
      });
      setMessageInput("");
    } else {
      alert("Please select a user and enter a message to send.");
    }
  };

  // Select a user to chat with
  const handleSelectUser = (user) => {
    setSelectedUser(user.id);
    setSelectedUserName(user.name);
    if (user.type === 0) {
      setChatType("user");
    } else if (user.type === 1) {
      setChatType("group");
    }
    // Filter messages for the selected user
    const filteredMessages = messages.filter(
      (msg) => msg.from === user.name || msg.to === user.name
    );
    setCurrentUserMessages(filteredMessages);
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleAddUser = () => {
    if (newUser.trim()) {
      addUser(newUser);
      setNewUser("");
    }
  };

  return (
    <div className="show-chat">
      <div className="user-info">
        <h2>Users</h2>
        <div className="user-list">
          {users
            .filter((user) => user.type === 0)
            .map((user) => (
              <div key={user.name} onClick={() => handleSelectUser(user)}>
                {user.name}
                <br />
                {user.actionTime}
              </div>
            ))}
        </div>
        <h2>Groups</h2>
        <div className="group-list">
          {users
            .filter((user) => user.type === 1)
            .map((user) => (
              <div key={user.name} onClick={() => handleSelectUser(user)}>
                {user.name}
                <br />
                {user.actionTime}
              </div>
            ))}
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div className="chat-messages">
        <div className="chat-header">{selectedUserName}</div>
        {currentUserMessages.length > 0 ? (
          currentUserMessages.map((message, index) => (
            <Message
              key={index}
              text={message.data?.data?.message}
              sender={message.data?.data?.sender === currentUser ? "me" : "you"}
            />
          ))
        ) : (
          <p>Please select a user to send the message.</p>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;

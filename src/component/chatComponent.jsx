import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "./Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket";
import { setUserList } from "../redux/actions/userListSlice";

const ChatComponent = ({ currentUser, onLogout }) => {
  const dispatch = useDispatch();
  const { messages, sendChatMessage, addUser } = useWebSocket(currentUser);
  const users = useSelector((state) => state.userList.users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatType, setChatType] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentUserMessages, setCurrentUserMessages] = useState([]);
  const [newUser, setNewUser] = useState("");

  // Handle incoming messages
  useEffect(() => {
    messages.forEach((message) => {
      console.log("Received message:", message);
      switch (message.event) {
        case "GET_USER_LIST":
          if (message.status === "success") {
            dispatch(setUserList(message.data));
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
  }, [messages, dispatch]);

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
    setChatType("private");
    // Filter messages for the selected user
    const filteredMessages = messages.filter(
      (msg) => msg.from === user.id || msg.to === user.id
    );
    setCurrentUserMessages(filteredMessages);
  };

  const handleLogout = (e) => {
    e.preventDefault();
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
          <div className="add-user">
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              placeholder="Add new user"
            />
            <button onClick={handleAddUser}>Add User</button>
          </div>
          <div className="user-list">
            {users.map((user) => (
              <div key={user.name} onClick={() => handleSelectUser(user)}>
                {user.name}
                <br />
                {user.actionTime}
              </div>
            ))}
          </div>
          <form onSubmit={handleLogout}>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </form>
        </div>
        <div className="chat-messages">
          <div className="chat-header">{selectedUserName}</div>
          {currentUserMessages.length > 0 ? (
            currentUserMessages.map((message, index) => (
              <Message
                key={index}
                text={message.data?.data?.message}
                sender={
                  message.data?.data?.sender === currentUser ? "me" : "you"
                }
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

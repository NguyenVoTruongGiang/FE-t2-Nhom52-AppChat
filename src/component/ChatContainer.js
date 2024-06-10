import React, { useState, useEffect } from "react";
import Message from "./Message";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import EmojiPicker from 'emoji-picker-react';
import "../App.css";
import useWebSocket from "../hooks/useWebSocket";

const ChatContainer = ({ currentUser, onLogout }) => {
  const { messages, sendChatMessage, users, addUser } = useWebSocket(currentUser);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatType, setChatType] = useState("people");
  const [currentUserMessages, setCurrentUserMessages] = useState([]);
  const [newUser, setNewUser] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      const filteredMessages = messages.filter((message) => {
        const data = message.data?.data;
        if (chatType === "people") {
          return (
            data &&
            ((data.sender === selectedUser && data.recipient === currentUser) ||
            (data.sender === currentUser && data.recipient === selectedUser))
          );
        } else if (chatType === "group") {
          return (
            data &&
            data.to === selectedUser
          );
        }
        return false;
      });
      setCurrentUserMessages(filteredMessages);
    }
  }, [selectedUser, messages, chatType, currentUser]);

  const handleAddUser = () => {
    if (newUser.trim()) {
      addUser(newUser);
      setNewUser("");
    }
  };

  const handleSelectUser = (user, type = "people") => {
    setSelectedUser(user);
    setSelectedUserName(user);
    setChatType(type);
  };

  const handleLogout = () => {
    onLogout();
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
  };

  const handleClickSend = () => {
    if (selectedUser) {
      sendChatMessage(selectedUser, messageInput, chatType);
      setMessageInput("");
    } else {
      alert("Please select a user to send the message.");
    }
  };

  return (
    <div className="chat-container">
      <div className="show-chat">
        <div className="user-info">
          <h2>Users</h2>
          <div className="user-list">
            {users.map((user, index) => (
              <div
                key={index}
                className={`user-item ${selectedUser === user ? "selected" : ""}`}
                onClick={() => handleSelectUser(user, "people")}
              >
                {user}
              </div>
            ))}
            {/* Thêm một nhóm người dùng giả định */}
            <div
              className={`user-item ${selectedUser === "group1" ? "selected" : ""}`}
              onClick={() => handleSelectUser("group1", "group")}
            >
              Group 1
            </div>
          </div>
          <div className="add-user">
            <input
              type="text"
              value={newUser}
              onChange={(e) => setNewUser(e.target.value)}
              placeholder="Add new user"
            />
            <button onClick={handleAddUser}>Add User</button>
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
                text={message.data?.data?.mes}
                sender={message.data?.data?.sender === currentUser ? "me" : "you"}
              />
            ))
          ) : (
            <p>Please select a user to send the message.</p>
          )}
        </div>
      </div>
      <div className="chat-input">
        <div className="emoji-icon" onClick={toggleEmojiPicker}>
          <FontAwesomeIcon icon={faSmile} />
        </div>
        {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
        <input
          type="text"
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <button onClick={handleClickSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatContainer;
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import "../App.css";
import useWebSocket from "../hooks/useWebSocket";
import ChatComponent from "./chatComponent";

const ChatContainer = ({ currentUser, onLogout }) => {
  const { sendChatMessage } = useWebSocket(currentUser);
  const [selectedUser] = useState(null);
  const [chatType] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
      <ChatComponent currentUser={currentUser} onLogout={onLogout}/>
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

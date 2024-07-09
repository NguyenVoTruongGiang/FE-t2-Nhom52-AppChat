import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Message from "./Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import "../App.css";
import useWebSocket from "../hooks/useWebSocket";
import { setUserList } from "../redux/actions/userListSlice";
import ChatComponent from "./chatComponent";

const ChatContainer = ({ currentUser, onLogout }) => {
  const dispatch = useDispatch();
  const { messages, sendChatMessage, addUser } = useWebSocket(currentUser);
  const users = useSelector((state) => state.userList.users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatType, setChatType] = useState("");
  const [currentUserMessages, setCurrentUserMessages] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newUser, setNewUser] = useState("");

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
      <ChatComponent />
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

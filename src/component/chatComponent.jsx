import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import "./chat.css";
import { WebSocketProvider, useWebSocket } from "../hooks/useWebSocket";
import { setUserList } from "../redux/actions/userListSlice";
import {
  addMessage,
  setChatMessages,
  } from "../redux/actions/chatSlice";

const ChatComponent = ({ currentUser, onLogout, mes = [] }) => {
  const dispatch = useDispatch();
  const {
    messages,
    getUserList,
    getRoomChatMessages,
    getPeopleChatMessages,
    sendChatMessage,
  } = useWebSocket(currentUser);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");
  const [filterType, setFilterType] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [username, setUsername] = useState('');
  // const username = useSelector((state) => state.user.username);
  const users = useSelector((state) => state.userList.users || []);
  const chatMessages = useSelector((state) => state.chat.chatMessages || []);

  useEffect(() => {
    getUserList();
  }, [getUserList]);

  useEffect(() => {
    const handleGetUserList = () => {
      if (messages && Array.isArray(messages)) {
        messages.forEach((message) => {
          if (
            message.event === "GET_USER_LIST" &&
            message.status === "success"
          ) {
            dispatch(setUserList(message.data));
          }
        });
      }
    };

    handleGetUserList();
  }, [messages, dispatch]);

  useEffect(() => {
    const handleSendMess = () => {
      if (messages && Array.isArray(messages)) {
        messages.forEach((message) => {
          if (
            message.event === "GET_PEOPLE_CHAT_MES" &&
            message.status === "success"
          ) {
            dispatch(setChatMessages([...message.data].reverse()));
          } else if (
            message.event === "GET_USER_LIST" &&
            message.status === "success"
          ) {
            dispatch(setUserList(message.data));
          }
        });
      }
    };

    handleSendMess();
  }, [messages, dispatch]);

  const handleSendMessage = () => {
    console.log("Username:", username);
    if (messageInput.trim() !== "" && selectedUser) {
      const newMessage = {
        id: Date.now(),
        name: username,
        type: 0,
        to: selectedUser,
        mes: messageInput,
        createAt: new Date().toISOString(),
      };
      sendChatMessage("people", selectedUser, messageInput);
      dispatch(addMessage(newMessage));
      setMessageInput("");
    } else {
      alert("Please select a user to send the message.");
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    setMessageInput((prev) => prev + emojiObject.emoji);
  };

  const handleChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user.name);
    setSelectedUserName(user.name);
    if (user.type === 0) {
      getPeopleChatMessages(user.name, 1);
    } else if (user.type === 1) {
      getRoomChatMessages(user.name, 1);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const filteredUsers = users.filter(
    (user) => filterType === null || user.type === filterType
  );

  return (
    <div className="chat-container">
      <div className="show-chat">
        <div className="user-info">
          <div className="btn-group" role="group" aria-label="Basic example">
            <button
              type="button"
              className={`btn ${
                filterType === 0 ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handleFilterChange(0)}
            >
              People
            </button>
            <button
              type="button"
              className={`btn ${
                filterType === 1 ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => handleFilterChange(1)}
            >
              Groups
            </button>
          </div>
          <ul className="user-list">
            {filteredUsers.map((user) => (
              <li
                className={`user-item ${selectedUser === user ? "active" : ""}`}
                key={user.name}
                onClick={() => handleSelectUser(user)}
              >
                <p>{user.name}</p>
                <p>{user.actionTime}</p>
              </li>
            ))}
          </ul>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        <div className="chat-messages">
          <div className="chat-header">{selectedUserName}</div>
          {mes.map((message) => (
            <div
              key={message.id}
              messages={chatMessages}
              username={username}
              className={`message-box ${
                username === currentUser ? "me" : "you"
              }`}
            >
              {message.mes}
            </div>
          ))}
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
          onChange={handleChange}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;

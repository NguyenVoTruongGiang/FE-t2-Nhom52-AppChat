import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile, faUser } from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import "./css/chat.css";
import { WebSocketProvider, useWebSocket } from "../hooks/useWebSocket";
import { setUserList, addUserToList } from "../redux/actions/userListSlice";
import { addMessage, setChatMessages } from "../redux/actions/chatSlice";

const ChatComponent = ({ currentUser, onLogout, mes = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [newUser, setNewUser] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const username = useSelector((state) => state.user.username);
  const users = useSelector((state) => state.userList.users || []);
  const chatMessages = useSelector((state) => state.chat.messages || []);
  const [virtualUsers, setVirtualUsers] = useState([]);

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
            console.log("Received people chat messages:", message.data);
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
    console.log("Username:", currentUser);
    if (messageInput.trim() !== "" && selectedUser) {
      const newMessage = {
        id: Date.now(),
        name: currentUser,
        type: 0,
        to: selectedUser,
        mes: messageInput,
        createAt: new Date().toISOString(),
      };
      console.log("Sending message:", newMessage);
      sendChatMessage("people", selectedUser, messageInput);
      dispatch(addMessage(newMessage));
      setMessageInput("");
    } else {
      alert("Please select a user to send the message.");
    }
  };

  const handleAddUser = () => {
    if (newUser.trim()) {
      const userType = filterType === 0 ? 0 : 1;
      const virtualUser = {
        name: newUser,
        type: userType,
        actionTime: new Date().toISOString(),
      };
      setVirtualUsers((prevVirtualUsers) => [...prevVirtualUsers, virtualUser]);
      setNewUser("");
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event, emojiObject) => {
    const emoji = emojiObject.emoji;
    if (emoji) {
      setMessageInput((prev) => prev + emoji);
    } else {
      console.error(
        "Emoji object does not contain a recognizable emoji property"
      );
    }
  };

  const handleChange = (event) => {
    setMessageInput(event.target.value);
  };

  const handleSelectUser = (username) => {
    setSelectedUser(username.name);
    setSelectedUserName(username.name);
    if (username.type === 0) {
      console.log("Fetching people chat messages for:", username.name);
      getPeopleChatMessages(username.name, 1);
    } else if (username.type === 1) {
      getRoomChatMessages(username.name, 1);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const filteredUsers =  [...users, ...virtualUsers].filter(
    (user) => filterType === null || user.type === filterType
  );

  return (
    <div className="chat-container">
      <div className="show-chat">
        <div className="user-info">
          <div className="typeBtn">
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
          <div>
            {filterType === 0 && (
              <div className="add-user">
                <input
                  type="text"
                  placeholder="Add new person"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                />
                <button onClick={handleAddUser}>Add Person</button>
              </div>
            )}
          </div>
          <ul className="user-list">
            {filteredUsers.map((user) => (
              <li
                className={`user-item ${selectedUser === user ? "active" : ""}`}
                key={user.name}
                onClick={() => handleSelectUser(user)}
              >
                <p>
                  <FontAwesomeIcon icon={faUser} />
                  {user.name}
                </p>
                <p>{user.actionTime}</p>
              </li>
            ))}
          </ul>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        <div className="chat-messages">
          <div className="chat-header">
            {selectedUser && <FontAwesomeIcon icon={faUser} />}
            {selectedUserName}
          </div>
          {Array.isArray(chatMessages) && chatMessages.length > 0 ? (
            chatMessages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.name === currentUser ? "me" : "you"
                }`}
              >
                <div style={{ fontSize: "15px" }}>
                  <FontAwesomeIcon icon={faUser} /> {message.name} <br />
                </div>
                <div style={{ margin: "5px" }}>{message.mes}</div>
                <div style={{ fontSize: "15px" }}>{message.createAt}</div>
              </div>
            ))
          ) : (
            <p>No messages to display</p>
          )}
        </div>
      </div>

      <div className="chat-input">
        <div className="emoji-icon" onClick={toggleEmojiPicker}>
          <FontAwesomeIcon icon={faSmile} />
        </div>
        {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
        <input
          className="inputMessage"
          type="text"
          placeholder="Type your message..."
          value={messageInput}
          onChange={handleChange}
        />
        <button onClick={handleSendMessage} className="btnSend">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;

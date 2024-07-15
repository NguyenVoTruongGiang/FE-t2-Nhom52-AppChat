import React from "react";
import "../App.css";
import ChatComponent from "./chatComponent";;

const ChatContainer = ({ currentUser, onLogout, messages }) => {

  return (
    <div>
      <ChatComponent currentUser={currentUser} onLogout={onLogout} messages={messages} />
    </div>
  );
};

export default ChatContainer;

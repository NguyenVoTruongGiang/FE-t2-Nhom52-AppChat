import React from "react";

function Message({ text, sender }) {
  return (
    <div className={`message ${sender === 'me' ? 'me' : 'you'}`}>
      {text}
    </div>
  );
}

export default Message;
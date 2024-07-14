import React from 'react';

function MessagesList({ messages }) {
  return (
    <ul>
      {messages.map((message) => (
        <li key={message.id}>
          <b>{message.sender}:</b> {message.content}
        </li>
      ))}
    </ul>
  );
}

export default MessagesList;
import React, { useState } from 'react';

function AddMessageForm({ onSubmit }) {
  const [messageText, setMessageText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText) {
      onSubmit(messageText);
      setMessageText(''); // Clear input after sending
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter your message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default AddMessageForm;

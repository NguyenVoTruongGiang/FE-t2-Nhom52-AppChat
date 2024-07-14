import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MessagesList from './components/MessagesList';
import AddMessageForm from './components/AddMessageForm';

function ChatRoom() {
  const messages = useSelector((state) => state.messages); // Get messages from Redux state
  const dispatch = useDispatch();

  const handleSendMessage = (message) => {
    // Dispatch an action to update the messages state with the new message
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  return (
    <div className="chat-room">
      <h2>Chat Room</h2>
      <MessagesList messages={messages} />
      <AddMessageForm onSubmit={handleSendMessage} />
    </div>
  );
}

export default ChatRoom;

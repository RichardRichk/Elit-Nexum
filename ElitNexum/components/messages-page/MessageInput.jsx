import { useState } from 'react';

const MessageInput = ({ sendMessage }) => {
  const [text, setText] = useState('');

  return (
    <form
      className="p-2 bg-gray-100"
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage(text);
        setText('');
      }}
    >
      <input
        className="w-full rounded border-violet border focus:ring-0 focus:border-deepviolet font-inconsolata"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Envie uma mensagem..."
      />
    </form>
  );
};

export default MessageInput;
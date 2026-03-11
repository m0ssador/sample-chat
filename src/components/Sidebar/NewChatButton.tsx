import React from 'react';

interface NewChatButtonProps {
  onClick?: () => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick}>
      + Новый чат
    </button>
  );
};

export default NewChatButton;

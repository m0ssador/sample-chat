import React from 'react';

interface NewChatButtonProps {
  onClick?: () => void;
  className?: string;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick, className }) => {
  return (
    <button type="button" className={className} onClick={onClick}>
      + Новый чат
    </button>
  );
};

export default NewChatButton;

import React, { useState } from 'react';
import MessageList from './MessageList/MessageList';
import InputArea from './InputArea';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import type { MessageData } from '../../types/message';
import styles from './ChatWindow.module.css';

const mockMessages: MessageData[] = [
  { id: 1, text: 'Привет! Как дела?', sender: 'user'},
  { id: 2, text: 'Здравствуйте! Всё хорошо, чем могу помочь?', sender: 'assistant'}
];

interface ChatWindowProps {
  isSettingsOpen: boolean;
  onCloseSettings: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isSettingsOpen, onCloseSettings }) => {
  const [messages, setMessages] = useState<MessageData[]>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <h3>Обсуждение проекта</h3>
        <button onClick={onCloseSettings} className={styles.settingsButton}>
          ⚙️ Настройки
        </button>
      </div>
      
      <MessageList messages={messages} isTyping={isTyping} />
      <InputArea />
      
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={onCloseSettings}
      />
    </div>
  );
};

export default ChatWindow;

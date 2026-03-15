import React, { useState } from 'react';
import MessageList from './MessageList/MessageList';
import InputArea from './InputArea';
import SettingsPanel from '../SettingsPanel/SettingsPanel';
import type { MessageData } from '../../types/types';
import styles from './ChatWindow.module.css';

import { mockMessages } from '../../mocks/data'

interface ChatWindowProps {
  isSettingsOpen: boolean;
  onToggleSettings: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isSettingsOpen, onToggleSettings }) => {
  const [messages, setMessages] = useState<MessageData[]>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className={styles.chatWindow}>
      <div className={styles.header}>
        <h3>Обсуждение проекта</h3>
        <button onClick={onToggleSettings} className={styles.settingsButton}>
          ⚙️ Настройки
        </button>
      </div>
      
      <MessageList messages={messages} isTyping={isTyping} />
      <InputArea />
      
      <SettingsPanel
        isOpen={isSettingsOpen}
        onToggle={onToggleSettings}
      />
    </div>
  );
};

export default ChatWindow;

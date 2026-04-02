import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import ChatWindow from './components/ChatWindow/ChatWindow';
import './index.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<ChatWindow />} />
          <Route path="chat/:chatId" element={<ChatWindow />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;

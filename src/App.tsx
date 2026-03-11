import { useState } from 'react';
import AppLayout from './components/Layout/AppLayout';
import './index.css';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="App">
      <AppLayout 
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </div>
  );
}

export default App;

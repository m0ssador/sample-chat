import React, { useState } from 'react';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  onLogin: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState('');
  const [scope, setScope] = useState('GIGACHAT_API_PERS');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!credentials) {
        return;
      }
      console.log('Авторизуемся с:', { credentials, scope });
      onLogin();
    } catch (err) {
      console.log('❌ Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.form} >
      <form onSubmit={handleLogin}>
        <h2>Авторизация</h2>
        <div>
          <label htmlFor="credentials">Credentials (Base64)</label>
          <input
            id="credentials"
            type="password"
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
          />
        </div>
        <div>
          <label>Scope</label>
          {['GIGACHAT_API_PERS', 'GIGACHAT_API_B2B', 'GIGACHAT_API_CORP'].map((s) => (
            <label key={s}>
              <input
                type="radio"
                value={s}
                checked={scope === s}
                onChange={() => setScope(s)}
              />
              {s}
            </label>
          ))}
        </div>
        <button 
          type="submit"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;

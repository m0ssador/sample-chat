import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm/AuthForm';
import styles from '../components/AuthForm/AuthForm.module.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginSuccess } from '../store/authSlice';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } } | null)?.from
      ?.pathname ?? '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className={styles.authContainer}>
      <AuthForm onLogin={() => dispatch(loginSuccess())} />
    </div>
  );
};

export default LoginPage;

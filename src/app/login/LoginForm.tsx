'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthForm from '@/components/AuthForm/AuthForm';
import styles from '@/components/AuthForm/AuthForm.module.css';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginSuccess } from '@/store/authSlice';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(from);
    }
  }, [isAuthenticated, from, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.authContainer}>
      <AuthForm onLogin={() => dispatch(loginSuccess())} />
    </div>
  );
}

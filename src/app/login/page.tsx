import React, { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="appRoot" aria-busy="true" />}>
      <LoginForm />
    </Suspense>
  );
}
